import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IYear } from "./year.interface";
import { Year } from "./year.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const createYear = async (payload: IYear): Promise<IYear | null> => {
  const isYearExist = await Year.findOne({ year: payload.year });
  if (isYearExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Year exist");
  }
  const result = await Year.create(payload);
  return result;
};

const getSingleYear = async (id: string): Promise<IYear | null> => {
  const result = await Year.findById(id);
  return result;
};

const getAllYears = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IYear[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const result = await Year.find().sort(sortConditions).skip(skip).limit(limit);

  const total = await Year.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateYear = async (
  id: string,
  payload: Partial<IYear>
): Promise<IYear | null> => {
  const result = await Year.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteYear = async (id: string): Promise<IYear | null> => {
  const result = await Year.findByIdAndDelete(id);
  return result;
};

export const YearService = {
  createYear,
  getSingleYear,
  getAllYears,
  updateYear,
  deleteYear,
};
