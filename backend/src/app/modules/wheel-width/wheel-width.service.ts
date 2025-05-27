import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { IWheelWidth } from "./wheel-width.interface";
import { WheelWidth } from "./wheel-width.model";

const createWheelWidth = async (
  payload: IWheelWidth
): Promise<IWheelWidth | null> => {
  const result = await WheelWidth.create(payload);
  return result;
};

const getSingleWheelWidth = async (id: string): Promise<IWheelWidth | null> => {
  const result = await WheelWidth.findById(id);
  return result;
};

const getAllWheelWidth = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IWheelWidth[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await WheelWidth.find()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await WheelWidth.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateWheelWidth = async (
  id: string,
  payload: Partial<IWheelWidth>
): Promise<IWheelWidth | null> => {
  const result = await WheelWidth.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteWheelWidth = async (id: string): Promise<IWheelWidth | null> => {
  const result = await WheelWidth.findByIdAndDelete(id);
  return result;
};

export const WheelWidthService = {
  createWheelWidth,
  getSingleWheelWidth,
  getAllWheelWidth,
  updateWheelWidth,
  deleteWheelWidth,
};
