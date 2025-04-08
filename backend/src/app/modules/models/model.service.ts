import { IModel } from "./model.interface";
import { Model } from "./model.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";

const createModel = async (payload: IModel): Promise<IModel | null> => {
  const result = await Model.create(payload);
  return result;
};

const getSingleModel = async (id: string): Promise<IModel | null> => {
  const result = await Model.findById(id).populate("make").populate("year");
  return result;
};

const getAllModels = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IModel[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Model.find()
    .populate("make")
    .populate("year")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Model.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateModel = async (
  id: string,
  payload: Partial<IModel>
): Promise<IModel | null> => {
  const result = await Model.findByIdAndUpdate(id, payload, {
    new: true,
  })
    .populate("make")
    .populate("year");
  return result;
};

const deleteModel = async (id: string): Promise<IModel | null> => {
  const result = await Model.findByIdAndDelete(id);
  return result;
};

export const ModelService = {
  createModel,
  getSingleModel,
  getAllModels,
  updateModel,
  deleteModel,
};
