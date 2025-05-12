import { Tire } from "./tire.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder, Types } from "mongoose";
import { ITire, ITireFilters } from "./tire.interface";
import { tireSearchableFields } from "./tire.constants";

const createTire = async (tireData: ITire): Promise<ITire> => {
  const result = await Tire.create(tireData);
  return result;
};

const getAllTires = async (
  filters: ITireFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITire[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: tireSearchableFields.map((field) => ({
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
        // Handle ObjectId fields
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
          ].includes(field)
        ) {
          return { [field]: new Types.ObjectId(String(value)) };
        }
        // Handle numeric fields
        if (
          field === "price" ||
          field === "stockQuantity" ||
          field === "sectionWidth" ||
          field === "aspectRatio" ||
          field === "rimDiameter" ||
          field === "width" ||
          field === "loadIndex"
        ) {
          return { [field]: Number(value) };
        }
        // Handle other fields
        return { [field]: value };
      }),
    });
  }

  // Rest of your code remains the same...
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Tire.find(whereConditions)
    .populate("year")
    .populate("make")
    .populate("model")
    .populate("trim")
    .populate("tireSize")
    .populate("drivingType")
    .populate("brand")
    .populate("category")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Tire.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleTire = async (id: string): Promise<ITire | null> => {
  const result = await Tire.findById(id).populate(
    "year make model trim tireSize brand category drivingType"
  );
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tire not found");
  }
  return result;
};

const updateTire = async (
  id: string,
  payload: Partial<ITire>
): Promise<ITire | null> => {
  const isExist = await Tire.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tire not found");
  }

  const result = await Tire.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
    .populate("year")
    .populate("make")
    .populate("model")
    .populate("trim")
    .populate("tireSize")
    .populate("drivingType")
    .populate("brand")
    .populate("category");

  return result;
};

const deleteTire = async (id: string): Promise<ITire | null> => {
  const result = await Tire.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tire not found");
  }
  return result;
};

export const TireService = {
  createTire,
  getAllTires,
  getSingleTire,
  updateTire,
  deleteTire,
};
