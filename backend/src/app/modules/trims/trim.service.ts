import { ITrim, ITrimFilters } from "./trim.interface";
import { Trim } from "./trim.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder, Types } from "mongoose";
import * as fs from "fs";
import { Year } from "../year/year.model";
import csvParser from "csv-parser";
import { Make } from "../makes/make.model";
import { CarModel } from "../models/model.model";
import { trimSearchableFields } from "./trim.constants";

const createTrim = async (payload: ITrim): Promise<ITrim | null> => {
  const result = await Trim.create(payload);
  return result;
};

const getSingleTrim = async (id: string): Promise<ITrim | null> => {
  const result = await Trim.findById(id)
    .populate("make")
    .populate("model")
    .populate("year");
  return result;
};

const getAllTrims = async (
  filters: ITrimFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITrim[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: trimSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const filterConditions = Object.entries(filtersData).map(
      ([field, value]) => {
        if (["make", "model", "year"].includes(field)) {
          return { [field]: new Types.ObjectId(value) };
        }
        return { [field]: value };
      }
    );
    andConditions.push({ $and: filterConditions });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Trim.find(whereConditions)
    .populate("make")
    .populate("model")
    .populate("year")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Trim.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateTrim = async (
  id: string,
  payload: Partial<ITrim>
): Promise<ITrim | null> => {
  const result = await Trim.findByIdAndUpdate(id, payload, {
    new: true,
  })
    .populate("make")
    .populate("model")
    .populate("year");
  return result;
};

const deleteTrim = async (id: string): Promise<ITrim | null> => {
  const result = await Trim.findByIdAndDelete(id);
  return result;
};

// const processCSVUpload = async (filePath: string): Promise<any> => {
//   const results: any[] = [];

//   // Read and parse the CSV file
//   await new Promise<void>((resolve, reject) => {
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (row: Record<string, any>) => {
//         results.push(row);
//       })
//       .on("end", () => {
//         resolve();
//       })
//       .on("error", (err: Error) => {
//         reject(err);
//       });
//   });

//   for (const row of results) {
//     // Check and create year
//     const yearExists = await Year.findOne({ year: Number(row.year) });
//     let year;
//     if (!yearExists) {
//       year = await Year.create({
//         year: { numeric: Number(row.year), display: row.year.toString() },
//       });
//     } else {
//       year = yearExists;
//     }

//     // Check and create make
//     const makeExists = await Make.findOne({ make: row.make });
//     let make;
//     if (!makeExists) {
//       make = await Make.create({
//         make: row.make,
//         logo: row.logo || "",
//       });
//     } else {
//       make = makeExists;
//     }

//     // Check and create model
//     const modelExists = await CarModel.findOne({ model: row.model });
//     let modelDoc;
//     if (!modelExists) {
//       modelDoc = await CarModel.create({
//         model: row.model,
//         make: make._id,
//         year: year._id,
//       });
//     } else {
//       modelDoc = modelExists;
//     }

//     // Check and create trim
//     const trimExists = await Trim.findOne({
//       trim: row.trim,
//     });
//     if (!trimExists) {
//       await Trim.create({
//         trim: row.trim,
//         make: make._id,
//         model: modelDoc._id,
//         year: year._id,
//       });
//     }
//   }

//   return { message: "CSV data processed successfully" };
// };

const processCSVUpload = async (filePath: string): Promise<any> => {
  const results: any[] = [];

  // Read and parse the CSV file
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row: Record<string, any>) => {
        results.push(row);
      })
      .on("end", () => {
        resolve();
      })
      .on("error", (err: Error) => {
        reject(err);
      });
  });

  // Process each row
  for (const row of results) {
    try {
      // 1. Handle Year - find or create
      const year = await Year.findOneAndUpdate(
        { "year.numeric": Number(row.year) },
        {
          $setOnInsert: {
            year: { numeric: Number(row.year), display: row.year.toString() },
          },
        },
        { upsert: true, new: true }
      );

      // 2. Handle Make - find or create
      const make = await Make.findOneAndUpdate(
        { make: row.make },
        { $setOnInsert: { make: row.make, logo: row.logo || "" } },
        { upsert: true, new: true }
      );

      // 3. Handle Model - find or create under this specific make and year
      const model = await CarModel.findOneAndUpdate(
        {
          model: row.model,
          make: make._id,
          year: year._id,
        },
        {
          $setOnInsert: {
            model: row.model,
            make: make._id,
            year: year._id,
          },
        },
        { upsert: true, new: true }
      );

      // 4. Handle Trim - find or create under this specific model, make, and year
      await Trim.findOneAndUpdate(
        {
          trim: row.trim,
          model: model._id,
          make: make._id,
          year: year._id,
        },
        {
          $setOnInsert: {
            trim: row.trim,
            model: model._id,
            make: make._id,
            year: year._id,
          },
        },
        { upsert: true }
      );
    } catch (error) {
      console.error(`Error processing row: ${JSON.stringify(row)}`, error);
      // You might want to continue processing other rows or throw the error
    }
  }

  return { message: "CSV data processed successfully" };
};

function csv(): any {
  return csvParser();
}

export const TrimService = {
  createTrim,
  getSingleTrim,
  getAllTrims,
  updateTrim,
  deleteTrim,
  processCSVUpload,
};
