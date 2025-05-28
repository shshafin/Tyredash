import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { IWheelWidthType } from "./wheel-width-type.interface";
import { WheelWidthType } from "./wheel-width-type.model";

const createWheelWidthType = async (
  payload: IWheelWidthType
): Promise<IWheelWidthType | null> => {
  const result = await WheelWidthType.create(payload);
  return result;
};

const getSingleWheelWidthType = async (
  id: string
): Promise<IWheelWidthType | null> => {
  const result = await WheelWidthType.findById(id);
  return result;
};

const getAllWheelWidthType = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IWheelWidthType[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await WheelWidthType.find()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await WheelWidthType.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateWheelWidthType = async (
  id: string,
  payload: Partial<IWheelWidthType>
): Promise<IWheelWidthType | null> => {
  const result = await WheelWidthType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteWheelWidthType = async (
  id: string
): Promise<IWheelWidthType | null> => {
  const result = await WheelWidthType.findByIdAndDelete(id);
  return result;
};

export const WheelWidthTypeService = {
  createWheelWidthType,
  getSingleWheelWidthType,
  getAllWheelWidthType,
  updateWheelWidthType,
  deleteWheelWidthType,
};
