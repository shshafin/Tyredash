import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { ITireSize, ITireSizeFilters } from "./tire-size.interface";
import { TireSize } from "./tire-size.model";
import { Types } from "mongoose";
import { tireSizeSearchableFields } from "./tire-size.constants";

const createTireSize = async (
  payload: ITireSize
): Promise<ITireSize | null> => {
  const result = await TireSize.create(payload);
  return result;
};

const getSingleTireSize = async (id: string): Promise<ITireSize | null> => {
  const result = await TireSize.findById(id)
    .populate("make")
    .populate("model")
    .populate("year")
    .populate("trim");
  return result;
};

const getAllTireSizes = async (
  filters: ITireSizeFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITireSize[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: tireSizeSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Filters implementation
  if (Object.keys(filtersData).length) {
    const filterConditions = Object.entries(filtersData).map(
      ([field, value]) => {
        // Handle ObjectId fields (make, model, year, trim)
        if (["make", "model", "year", "trim"].includes(field)) {
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

  const result = await TireSize.find(whereConditions)
    .populate("make")
    .populate("model")
    .populate("year")
    .populate("trim")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await TireSize.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateTireSize = async (
  id: string,
  payload: Partial<ITireSize>
): Promise<ITireSize | null> => {
  const result = await TireSize.findByIdAndUpdate(id, payload, {
    new: true,
  })
    .populate("make")
    .populate("model")
    .populate("trim")
    .populate("year");
  return result;
};

const deleteTireSize = async (id: string): Promise<ITireSize | null> => {
  const result = await TireSize.findByIdAndDelete(id);
  return result;
};

export const TireService = {
  createTireSize,
  getSingleTireSize,
  getAllTireSizes,
  updateTireSize,
  deleteTireSize,
};
