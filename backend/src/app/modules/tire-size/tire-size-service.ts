import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { ITireSize } from "./tire-size.interface";
import { TireSize } from "./tire-size.model";

const createTireSize = async (
  payload: ITireSize
): Promise<ITireSize | null> => {
  const result = await TireSize.create(payload);
  return result;
};

const getSingleTireSize = async (id: string): Promise<ITireSize | null> => {
  const result = await TireSize.findById(id)
    .populate("make")
    .populate("model")
    .populate("year")
    .populate("trim");
  return result;
};

const getAllTireSizes = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITireSize[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await TireSize.find()
    .populate("make")
    .populate("model")
    .populate("year")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await TireSize.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateTireSize = async (
  id: string,
  payload: Partial<ITireSize>
): Promise<ITireSize | null> => {
  const result = await TireSize.findByIdAndUpdate(id, payload, {
    new: true,
  })
    .populate("make")
    .populate("model")
    .populate("trim")
    .populate("year");
  return result;
};

const deleteTireSize = async (id: string): Promise<ITireSize | null> => {
  const result = await TireSize.findByIdAndDelete(id);
  return result;
};

export const TireService = {
  createTireSize,
  getSingleTireSize,
  getAllTireSizes,
  updateTireSize,
  deleteTireSize,
};
