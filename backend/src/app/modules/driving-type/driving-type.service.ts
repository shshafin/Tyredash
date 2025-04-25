import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { IDrivingType, IDrivingTypeFilters } from "./driving-type.interface";
import { DrivingType } from "./driving-type.model";
import { drivingTypeSearchableFields } from "./driving-type.constants";

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
  filters: IDrivingTypeFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IDrivingType[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: drivingTypeSearchableFields.map((field) => ({
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

  const result = await DrivingType.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await DrivingType.countDocuments(whereConditions);

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
