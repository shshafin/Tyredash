import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { ITireRatio } from "./tire-ratio.interface";
import { TireRatio } from "./tire-ratio.model";

const createTireRatio = async (
  payload: ITireRatio
): Promise<ITireRatio | null> => {
  const result = await TireRatio.create(payload);
  return result;
};

const getSingleTireRatio = async (id: string): Promise<ITireRatio | null> => {
  const result = await TireRatio.findById(id);
  return result;
};

const getAllTireRatio = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITireRatio[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await TireRatio.find()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await TireRatio.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateTireRatio = async (
  id: string,
  payload: Partial<ITireRatio>
): Promise<ITireRatio | null> => {
  const result = await TireRatio.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteTireRatio = async (id: string): Promise<ITireRatio | null> => {
  const result = await TireRatio.findByIdAndDelete(id);
  return result;
};

export const TireRatioService = {
  createTireRatio,
  getSingleTireRatio,
  getAllTireRatio,
  updateTireRatio,
  deleteTireRatio,
};
