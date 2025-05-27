import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { IWheelDiameter } from "./wheel-diameter.interface";
import { WheelDiameter } from "./wheel-diameter.model";

const createWheelDiameter = async (
  payload: IWheelDiameter
): Promise<IWheelDiameter | null> => {
  const result = await WheelDiameter.create(payload);
  return result;
};

const getSingleWheelDiameter = async (
  id: string
): Promise<IWheelDiameter | null> => {
  const result = await WheelDiameter.findById(id);
  return result;
};

const getAllWheelDiameter = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IWheelDiameter[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await WheelDiameter.find()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await WheelDiameter.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateWheelDiameter = async (
  id: string,
  payload: Partial<IWheelDiameter>
): Promise<IWheelDiameter | null> => {
  const result = await WheelDiameter.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteWheelDiameter = async (
  id: string
): Promise<IWheelDiameter | null> => {
  const result = await WheelDiameter.findByIdAndDelete(id);
  return result;
};

export const WheelDiameterService = {
  createWheelDiameter,
  getSingleWheelDiameter,
  getAllWheelDiameter,
  updateWheelDiameter,
  deleteWheelDiameter,
};
