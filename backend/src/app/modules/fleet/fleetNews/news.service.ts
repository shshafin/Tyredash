import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../../interfaces/common";
import { IPaginationOptions } from "../../../../interfaces/pagination";
import { fleetNewsSearchableFields } from "./news.constants";
import { IFleetNews, IFleetNewsFilters } from "./news.interface";
import { FleetNews } from "./news.model";
import ApiError from "../../../../errors/ApiError";

import httpStatus from "http-status";

const createFleetNews = async (payload: IFleetNews): Promise<IFleetNews> => {
  const result = await FleetNews.create(payload);
  return result;
};

const getAllFleetNews = async (
  filters: IFleetNewsFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IFleetNews[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: fleetNewsSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await FleetNews.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await FleetNews.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleFleetNews = async (id: string): Promise<IFleetNews | null> => {
  const result = await FleetNews.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet news not found");
  }
  return result;
};

const updateFleetNews = async (
  id: string,
  payload: Partial<IFleetNews>
): Promise<IFleetNews | null> => {
  const isExist = await FleetNews.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet news not found");
  }

  const result = await FleetNews.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteFleetNews = async (id: string): Promise<IFleetNews | null> => {
  const result = await FleetNews.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet news not found");
  }

  return result;
};

// Additional Functions
const getFeaturedFleetNews = async (
  limit: number = 3
): Promise<IFleetNews[]> => {
  const result = await FleetNews.find({ status: "featured" })
    .sort({ createdAt: -1 })
    .limit(limit);
  return result;
};

const getRecentFleetNews = async (limit: number = 5): Promise<IFleetNews[]> => {
  const result = await FleetNews.find().sort({ createdAt: -1 }).limit(limit);
  return result;
};

export const FleetNewsService = {
  createFleetNews,
  getAllFleetNews,
  getSingleFleetNews,
  updateFleetNews,
  deleteFleetNews,
  getFeaturedFleetNews,
  getRecentFleetNews,
};
