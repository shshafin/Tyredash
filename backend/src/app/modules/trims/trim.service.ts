import { ITrim } from "./trim.interface";
import { Trim } from "./trim.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";

const createTrim = async (payload: ITrim): Promise<ITrim | null> => {
  const result = await Trim.create(payload);
  return result;
};

const getSingleTrim = async (id: string): Promise<ITrim | null> => {
  const result = await Trim.findById(id)
    .populate("make")
    .populate("model")
    .populate("year");
  return result;
};

const getAllTrims = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITrim[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Trim.find()
    .populate("make")
    .populate("model")
    .populate("year")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Trim.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateTrim = async (
  id: string,
  payload: Partial<ITrim>
): Promise<ITrim | null> => {
  const result = await Trim.findByIdAndUpdate(id, payload, {
    new: true,
  })
    .populate("make")
    .populate("model")
    .populate("year");
  return result;
};

const deleteTrim = async (id: string): Promise<ITrim | null> => {
  const result = await Trim.findByIdAndDelete(id);
  return result;
};

export const TrimService = {
  createTrim,
  getSingleTrim,
  getAllTrims,
  updateTrim,
  deleteTrim,
};
