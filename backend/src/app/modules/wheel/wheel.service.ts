import { IWheel } from "./wheel.interface";
import { Wheel } from "./wheel.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { IWheelFilters } from "./wheel.interface";
import { Types } from "mongoose";
import { wheelSearchableFields } from "./wheel.constants";
import fs from "fs";
import csv from "csv-parser";
import { Year } from "../year/year.model";
import { Make } from "../makes/make.model";
import { CarModel } from "../models/model.model";
import { Trim } from "../trims/trim.model";
import { TireSize } from "../tire-size/tire-size.model";
import { Brand } from "../brand/brand.model";
import { Category } from "../category/category.model";
import { DrivingType } from "../driving-type/driving-type.model";
import { WheelWidth } from "../wheel-width/wheel-width.model";
import { WheelRatio } from "../wheel-ratio/wheel-ratio.model";
import { WheelDiameter } from "../wheel-diameter/wheel-diameter.model";
import { VehicleType } from "../vehicle-type/vehicle-type.model";
import { WheelWidthType } from "../wheel-width-type/wheel-width-type.model";

const createWheel = async (wheelData: IWheel): Promise<IWheel> => {
  const result = await Wheel.create(wheelData);
  return result;
};

const getAllWheels = async (
  filters: IWheelFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IWheel[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: wheelSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (
          [
            "year",
            "make",
            "model",
            "trim",
            "tireSize",
            "drivingType",
            "brand",
            "category",
            "width",
            "ratio",
            "diameter",
            "vehicleType",
            "widthType",
          ].includes(field)
        ) {
          if (!Types.ObjectId.isValid(String(value))) {
            throw new ApiError(httpStatus.BAD_REQUEST, `Invalid ${field} ID`);
          }
          return { [field]: new Types.ObjectId(String(value)) };
        }

        if (
          field === "price" ||
          field === "stockQuantity" ||
          field === "rimDiameter" ||
          field === "rimWidth" ||
          field === "offset" ||
          field === "hubBoreSize" ||
          field === "numberOFBolts" ||
          field === "loadCapacity"
        ) {
          return { [field]: Number(value) };
        }

        return { [field]: value };
      }),
    });
  }

  // Sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // Database query
  const result = await Wheel.find(whereConditions)
    .populate("year")
    .populate("make")
    .populate("model")
    .populate("trim")
    .populate("tireSize")
    .populate("drivingType")
    .populate("brand")
    .populate("category")
    .populate("width")
    .populate("ratio")
    .populate("diameter")
    .populate("vehicleType")
    .populate("widthType")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Wheel.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleWheel = async (id: string): Promise<IWheel | null> => {
  const result = await Wheel.findById(id).populate(
    "year make model trim tireSize brand category drivingType width ratio diameter vehicleType widthType"
  );
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wheel not found");
  }
  return result;
};

const updateWheel = async (
  id: string,
  payload: Partial<IWheel>
): Promise<IWheel | null> => {
  const isExist = await Wheel.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wheel not found");
  }

  const result = await Wheel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate([
    { path: "year", select: "year" },
    { path: "make", select: "name" },
    { path: "model", select: "name" },
    { path: "trim", select: "name" },
    { path: "tireSize", select: "size" },
    { path: "drivingType", select: "title" },
    { path: "brand", select: "name" },
    { path: "width", select: "width" },
    { path: "ratio", select: "ratio" },
    { path: "diameter", select: "diameter" },
    { path: "vehicleType", select: "vehicleType" },
    { path: "widthType", select: "widthType" },
  ]);
  return result;
};

const deleteWheel = async (id: string): Promise<IWheel | null> => {
  const result = await Wheel.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wheel not found");
  }
  return result;
};

// const uploadWheelCSV = async (filePath: string): Promise<any> => {
//   const results: any[] = [];

//   // Read the CSV file
//   await new Promise<void>((resolve, reject) => {
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (row) => results.push(row))
//       .on("end", resolve)
//       .on("error", reject);
//   });

//   // Iterate over each row of CSV data
//   for (const row of results) {
//     try {
//       // Look up or insert the Year
//       const year = await Year.findOneAndUpdate(
//         { year: parseInt(row.year) },
//         { $setOnInsert: { year: parseInt(row.year) } },
//         { upsert: true, new: true }
//       );

//       // Look up or insert the Make
//       const make = await Make.findOneAndUpdate(
//         { make: row.make },
//         { $setOnInsert: { make: row.make, logo: row.logo || "" } },
//         { upsert: true, new: true }
//       );

//       // Look up or insert the Car Model
//       const model = await CarModel.findOneAndUpdate(
//         { model: row.model, make: make._id, year: year._id },
//         { $setOnInsert: { model: row.model, make: make._id, year: year._id } },
//         { upsert: true, new: true }
//       );

//       // Look up or insert the Trim
//       const trim = await Trim.findOneAndUpdate(
//         { trim: row.trim, model: model._id, make: make._id, year: year._id },
//         {
//           $setOnInsert: {
//             trim: row.trim,
//             model: model._id,
//             make: make._id,
//             year: year._id,
//           },
//         },
//         { upsert: true, new: true }
//       );

//       // Look up or insert the Tire Size
//       const tireSize = await TireSize.findOneAndUpdate(
//         {
//           tireSize: row.tireSize,
//           make: make._id,
//           model: model._id,
//           year: year._id,
//           trim: trim._id,
//         },
//         {
//           $setOnInsert: {
//             tireSize: row.tireSize,
//             trim: trim._id,
//             model: model._id,
//             make: make._id,
//             year: year._id,
//           },
//         },
//         { upsert: true, new: true }
//       );

//       // Look up or insert the Brand
//       const brand = await Brand.findOneAndUpdate(
//         { name: row.brand },
//         {
//           $setOnInsert: {
//             name: row.brand,
//             description: row.brandDescription || "",
//             logo: row.brandLogo || "",
//           },
//         },
//         { upsert: true, new: true }
//       );

//       // Look up or insert the Category
//       const category = await Category.findOneAndUpdate(
//         { name: row.category },
//         {
//           $setOnInsert: {
//             name: row.category,
//             slug: row.categorySlug || row.category.toLowerCase(),
//             isActive: true,
//           },
//         },
//         { upsert: true, new: true }
//       );

//       // Look up or insert the Driving Type
//       const drivingType = await DrivingType.findOneAndUpdate(
//         {
//           title: row.drivingTypeTitle,
//           subTitle: row.drivingTypeSubTitle,
//         },
//         {
//           $setOnInsert: {
//             title: row.drivingTypeTitle,
//             subTitle: row.drivingTypeSubTitle,
//             options: row.drivingTypeOptions
//               ? row.drivingTypeOptions.split(",")
//               : [],
//           },
//         },
//         { upsert: true, new: true }
//       );

//       const width = await WheelWidth.findOneAndUpdate(
//         { width: row.width },
//         { $setOnInsert: { width: row.width } },
//         { upsert: true, new: true }
//       );

//       const ratio = await WheelRatio.findOneAndUpdate(
//         { ratio: row.ratio },
//         { $setOnInsert: { ratio: row.ratio } },
//         { upsert: true, new: true }
//       );

//       const diameter = await WheelDiameter.findOneAndUpdate(
//         { diameter: row.diameter },
//         { $setOnInsert: { diameter: row.diameter } },
//         { upsert: true, new: true }
//       );

//       const vehicleType = await VehicleType.findOneAndUpdate(
//         { vehicleType: row.vehicleType },
//         { $setOnInsert: { vehicleType: row.vehicleType } },
//         { upsert: true, new: true }
//       );

//       const widthType = await WheelWidthType.findOneAndUpdate(
//         { widthType: row.widthType },
//         { $setOnInsert: { widthType: row.widthType } },
//         { upsert: true, new: true }
//       );
//       // Look up or insert the Wheel data
//       await Wheel.findOneAndUpdate(
//         {
//           year: year._id,
//           make: make._id,
//           model: model._id,
//           trim: trim._id,
//           tireSize: tireSize._id,
//           drivingType: drivingType?._id,
//         },
//         {
//           $setOnInsert: {
//             name: row.name,
//             year: year._id,
//             make: make._id,
//             model: model._id,
//             trim: trim._id,
//             tireSize: tireSize._id,
//             drivingType: drivingType?._id,
//             brand: brand._id,
//             category: category._id,
//             width: width?._id,
//             ratio: ratio?._id,
//             diameter: diameter?._id,
//             vehicleType: vehicleType?._id,
//             widthType: widthType?._id,
//             description: row.description || "",
//             images: row.images ? row.images.split(",") : [],
//             productLine: row.productLine || "",
//             unitName: row.unitName || "",
//             grossWeight: row.grossWeight || "",
//             conditionInfo: row.conditionInfo || "",
//             GTIN: row.GTIN || "",
//             ATVOffset: row.ATVOffset || "",
//             BoltsQuantity: row.BoltsQuantity || "",
//             wheelColor: row.wheelColor || "",
//             hubBore: row.hubBore || "",
//             materialType: row.materialType || "",
//             wheelSize: row.wheelSize || "",
//             wheelAccent: row.wheelAccent || "",
//             wheelPieces: row.wheelPieces || "",
//             RimDiameter: parseNumber(row.RimDiameter),
//             RimWidth: parseNumber(row.RimWidth),
//             boltPattern: row.boltPattern || "",
//             offset: parseNumber(row.offset),
//             hubBoreSize: parseNumber(row.hubBoreSize),
//             numberOFBolts: parseNumber(row.numberOFBolts),
//             loadCapacity: parseNumber(row.loadCapacity),
//             loadRating: parseNumber(row.loadRating),
//             finish: row.finish || "",
//             warranty: row.warranty || "",
//             constructionType: row.constructionType || "",
//             wheelType: row.wheelType || "",
//             price: parseNumber(row.price),
//             discountPrice: parseNumber(row.discountPrice),
//             stockQuantity: parseNumber(row.stockQuantity),
//           },
//         },
//         { upsert: true }
//       );
//     } catch (error) {
//       console.error(`Error processing row: ${JSON.stringify(row)}`, error);
//     }
//   }

//   return { message: "CSV data processed successfully" };
// };

const uploadWheelCSV = async (filePath: string): Promise<any> => {
  const results: any[] = [];

  // Read the CSV file
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  // Iterate over each row of CSV data
  for (const row of results) {
    try {
      // Check and create or find the Year
      let year = await Year.findOne({ year: parseInt(row.year) });
      if (!year) {
        year = await Year.create({ year: parseInt(row.year) });
      }

      // Check and create or find the Make
      let make = await Make.findOne({ make: row.make });
      if (!make) {
        make = await Make.create({ make: row.make, logo: row.logo || "" });
      }

      // Check and create or find the Car Model
      let model = await CarModel.findOne({
        model: row.model,
        make: make._id,
        year: year._id,
      });
      if (!model) {
        model = await CarModel.create({
          model: row.model,
          make: make._id,
          year: year._id,
        });
      }

      // Check and create or find the Trim
      let trim = await Trim.findOne({
        trim: row.trim,
        model: model._id,
        make: make._id,
        year: year._id,
      });
      if (!trim) {
        trim = await Trim.create({
          trim: row.trim,
          model: model._id,
          make: make._id,
          year: year._id,
        });
      }

      // Check and create or find the Tire Size
      let tireSize = await TireSize.findOne({
        tireSize: row.tireSize,
        trim: trim._id,
      });
      if (!tireSize) {
        tireSize = await TireSize.create({
          tireSize: row.tireSize,
          trim: trim._id,
          model: model._id,
          make: make._id,
          year: year._id,
        });
      }

      // Check and create or find the Brand
      let brand = await Brand.findOne({ name: row.brand });
      if (!brand) {
        brand = await Brand.create({
          name: row.brand,
          description: row.brandDescription || "",
          logo: row.brandLogo || "",
        });
      }

      // Check and create or find the Category
      let category = await Category.findOne({ name: row.category });
      if (!category) {
        category = await Category.create({
          name: row.category,
          slug: row.categorySlug || row.category.toLowerCase(),
          isActive: true,
        });
      }

      // Check and create or find the Driving Type
      let drivingType = await DrivingType.findOne({
        title: row.drivingTypeTitle,
        subTitle: row.drivingTypeSubTitle,
      });
      if (!drivingType) {
        drivingType = await DrivingType.create({
          title: row.drivingTypeTitle,
          subTitle: row.drivingTypeSubTitle,
          options: row.drivingTypeOptions
            ? row.drivingTypeOptions.split(",")
            : [],
        });
      }

      // Check and create or find the Wheel Width
      let width = await WheelWidth.findOne({ width: row.width });
      if (!width) {
        width = await WheelWidth.create({ width: row.width });
      }

      // Check and create or find the Wheel Ratio
      let ratio = await WheelRatio.findOne({ ratio: row.ratio });
      if (!ratio) {
        ratio = await WheelRatio.create({ ratio: row.ratio });
      }

      // Check and create or find the Wheel Diameter
      let diameter = await WheelDiameter.findOne({ diameter: row.diameter });
      if (!diameter) {
        diameter = await WheelDiameter.create({ diameter: row.diameter });
      }

      // Check and create or find the Vehicle Type
      let vehicleType = await VehicleType.findOne({
        vehicleType: row.vehicleType,
      });
      if (!vehicleType) {
        vehicleType = await VehicleType.create({
          vehicleType: row.vehicleType,
        });
      }

      // Check and create or find the Wheel Width Type
      let widthType = await WheelWidthType.findOne({
        widthType: row.widthType,
      });
      if (!widthType) {
        widthType = await WheelWidthType.create({ widthType: row.widthType });
      }

      // Now create or update the Wheel data
      await Wheel.findOneAndUpdate(
        {
          name: row.name,
          year: year._id,
          make: make._id,
          model: model._id,
          trim: trim._id,
          tireSize: tireSize._id,
          drivingType: drivingType?._id,
        },
        {
          $setOnInsert: {
            name: row.name,
            year: year._id,
            make: make._id,
            model: model._id,
            trim: trim._id,
            tireSize: tireSize._id,
            drivingType: drivingType?._id,
            brand: brand._id,
            category: category._id,
            width: width?._id,
            ratio: ratio?._id,
            diameter: diameter?._id,
            vehicleType: vehicleType?._id,
            widthType: widthType?._id,
            description: row.description || "",
            images: row.images ? row.images.split(",") : [],
            productLine: row.productLine || "",
            unitName: row.unitName || "",
            grossWeight: row.grossWeight || "",
            conditionInfo: row.conditionInfo || "",
            GTIN: row.GTIN || "",
            ATVOffset: row.ATVOffset || "",
            BoltsQuantity: row.BoltsQuantity || "",
            wheelColor: row.wheelColor || "",
            hubBore: row.hubBore || "",
            materialType: row.materialType || "",
            wheelSize: row.wheelSize || "",
            wheelAccent: row.wheelAccent || "",
            wheelPieces: row.wheelPieces || "",
            RimDiameter: parseNumber(row.RimDiameter),
            RimWidth: parseNumber(row.RimWidth),
            boltPattern: row.boltPattern || "",
            offset: parseNumber(row.offset),
            hubBoreSize: parseNumber(row.hubBoreSize),
            numberOFBolts: parseNumber(row.numberOFBolts),
            loadCapacity: parseNumber(row.loadCapacity),
            loadRating: parseNumber(row.loadRating),
            finish: row.finish || "",
            warranty: row.warranty || "",
            constructionType: row.constructionType || "",
            wheelType: row.wheelType || "",
            price: parseNumber(row.price),
            discountPrice: parseNumber(row.discountPrice),
            stockQuantity: parseNumber(row.stockQuantity),
          },
        },
        { upsert: true }
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Error processing row: ${JSON.stringify(row)} - Error: ${error.message}`
        );
      } else {
        console.error(
          `Error processing row: ${JSON.stringify(row)} - Error: ${String(error)}`
        );
      }
    }
  }

  return { message: "CSV data processed successfully" };
};

function parseNumber(value: any): number {
  return isNaN(value) ? 0 : parseFloat(value);
}

export const WheelService = {
  createWheel,
  getAllWheels,
  getSingleWheel,
  updateWheel,
  deleteWheel,
  uploadWheelCSV,
};
