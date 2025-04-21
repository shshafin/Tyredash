import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { IDrivingType } from "./driving-type.interface";
import { DrivingType } from "./driving-type.model";

const createDrivingType = async (
  payload: IDrivingType
): Promise<IDrivingType | null> => {
  const result = await DrivingType.create(payload);
  return result;
};

const getSingleDrivingType = async (
  id: string
): Promise<IDrivingType | null> => {
  const result = await DrivingType.findById(id);
  return result;
};

const getAllDrivingTypes = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IDrivingType[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await DrivingType.find()
    // .populate("year")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await DrivingType.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateDrivingType = async (
  id: string,
  payload: Partial<IDrivingType>
): Promise<IDrivingType | null> => {
  const result = await DrivingType.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate("year");
  return result;
};

const deleteDrivingType = async (id: string): Promise<IDrivingType | null> => {
  const result = await DrivingType.findByIdAndDelete(id);
  return result;
};

export const DrivingTypeService = {
  createDrivingType,
  getSingleDrivingType,
  getAllDrivingTypes,
  updateDrivingType,
  deleteDrivingType,
};
