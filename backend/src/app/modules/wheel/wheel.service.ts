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
      $or: ["name", "boltPattern", "wheelType", "category", "finish"].map(
        (field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })
      ),
    });
  }

  if (Object.keys(filtersData).length) {
    const filterConditions = Object.entries(filtersData).map(
      ([field, value]) => {
        if (
          ["year", "make", "model", "trim", "tireSize", "brand"].includes(field)
        ) {
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

  const result = await Wheel.find(whereConditions)
    .populate("year")
    .populate("make")
    .populate("model")
    .populate("trim")
    .populate("tireSize")
    .populate("brand")
    .populate("category")
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
  const result = await Wheel.findById(id).populate([
    { path: "year", select: "year" },
    { path: "make", select: "name" },
    { path: "model", select: "name" },
    { path: "trim", select: "name" },
    { path: "tireSize", select: "size" },
    { path: "brand", select: "name" },
  ]);
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
    { path: "brand", select: "name" },
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

export const WheelService = {
  createWheel,
  getAllWheels,
  getSingleWheel,
  updateWheel,
  deleteWheel,
};
