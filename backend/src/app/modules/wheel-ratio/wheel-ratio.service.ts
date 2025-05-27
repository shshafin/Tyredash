import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { IWheelRatio } from "./wheel-ratio.interface";
import { WheelRatio } from "./wheel-ratio.model";

const createWheelRatio = async (
  payload: IWheelRatio
): Promise<IWheelRatio | null> => {
  const result = await WheelRatio.create(payload);
  return result;
};

const getSingleWheelRatio = async (id: string): Promise<IWheelRatio | null> => {
  const result = await WheelRatio.findById(id);
  return result;
};

const getAllWheelRatio = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IWheelRatio[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await WheelRatio.find()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await WheelRatio.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateWheelRatio = async (
  id: string,
  payload: Partial<IWheelRatio>
): Promise<IWheelRatio | null> => {
  const result = await WheelRatio.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteWheelRatio = async (id: string): Promise<IWheelRatio | null> => {
  const result = await WheelRatio.findByIdAndDelete(id);
  return result;
};

export const WheelRatioService = {
  createWheelRatio,
  getSingleWheelRatio,
  getAllWheelRatio,
  updateWheelRatio,
  deleteWheelRatio,
};
