import { IMake } from "./make.interface";
import { Make } from "./make.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";

const createMake = async (payload: IMake): Promise<IMake | null> => {
  const result = await Make.create(payload);
  return result;
};

const getSingleMake = async (id: string): Promise<IMake | null> => {
  const result = await Make.findById(id);
  return result;
};

const getAllMakes = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IMake[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Make.find().sort(sortConditions).skip(skip).limit(limit);

  const total = await Make.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateMake = async (
  id: string,
  payload: Partial<IMake>
): Promise<IMake | null> => {
  const result = await Make.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteMake = async (id: string): Promise<IMake | null> => {
  const result = await Make.findByIdAndDelete(id);
  return result;
};

export const MakeService = {
  createMake,
  getSingleMake,
  getAllMakes,
  updateMake,
  deleteMake,
};
