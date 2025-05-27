import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { ITireWidth } from "./tire-width.interface";
import { TireWidth } from "./tire-width.model";

const createTireWidth = async (
  payload: ITireWidth
): Promise<ITireWidth | null> => {
  const result = await TireWidth.create(payload);
  return result;
};

const getSingleTireWidth = async (id: string): Promise<ITireWidth | null> => {
  const result = await TireWidth.findById(id);
  return result;
};

const getAllTireWidth = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITireWidth[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await TireWidth.find()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await TireWidth.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateTireWidth = async (
  id: string,
  payload: Partial<ITireWidth>
): Promise<ITireWidth | null> => {
  const result = await TireWidth.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteTireWidth = async (id: string): Promise<ITireWidth | null> => {
  const result = await TireWidth.findByIdAndDelete(id);
  return result;
};

export const TireWidthService = {
  createTireWidth,
  getSingleTireWidth,
  getAllTireWidth,
  updateTireWidth,
  deleteTireWidth,
};
