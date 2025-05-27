import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { ITireDiameter } from "./tire-diameter.interface";
import { TireDiameter } from "./tire-diameter.model";

const createTireDiameter = async (
  payload: ITireDiameter
): Promise<ITireDiameter | null> => {
  const result = await TireDiameter.create(payload);
  return result;
};

const getSingleTireDiameter = async (
  id: string
): Promise<ITireDiameter | null> => {
  const result = await TireDiameter.findById(id);
  return result;
};

const getAllTireDiameter = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITireDiameter[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await TireDiameter.find()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await TireDiameter.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateTireDiameter = async (
  id: string,
  payload: Partial<ITireDiameter>
): Promise<ITireDiameter | null> => {
  const result = await TireDiameter.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteTireDiameter = async (
  id: string
): Promise<ITireDiameter | null> => {
  const result = await TireDiameter.findByIdAndDelete(id);
  return result;
};

export const TireDiameterService = {
  createTireDiameter,
  getSingleTireDiameter,
  getAllTireDiameter,
  updateTireDiameter,
  deleteTireDiameter,
};
