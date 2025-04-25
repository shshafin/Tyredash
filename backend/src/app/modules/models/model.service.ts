import { IModel, IModelFilters } from "./model.interface";
import { CarModel } from "./model.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { modelSearchableFields } from "./model.constants";

const createModel = async (payload: IModel): Promise<IModel | null> => {
  const result = (
    await (await CarModel.create(payload)).populate("make")
  ).populate("year");
  return result;
};

const getSingleModel = async (id: string): Promise<IModel | null> => {
  const result = await CarModel.findById(id).populate("make").populate("year");
  return result;
};

const getAllModels = async (
  filters: IModelFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IModel[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: modelSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Filters implementation
  if (Object.keys(filtersData).length) {
    const filterConditions = Object.entries(filtersData).map(
      ([field, value]) => ({
        [field]: value,
      })
    );
    andConditions.push({ $and: filterConditions });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await CarModel.find(whereConditions)
    .populate("make")
    .populate("year")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await CarModel.countDocuments(whereConditions);

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
  const result = await CarModel.findByIdAndUpdate(id, payload, {
    new: true,
  })
    .populate("make")
    .populate("year");
  return result;
};

const deleteModel = async (id: string): Promise<IModel | null> => {
  const result = await CarModel.findByIdAndDelete(id);
  return result;
};

export const ModelService = {
  createModel,
  getSingleModel,
  getAllModels,
  updateModel,
  deleteModel,
};
