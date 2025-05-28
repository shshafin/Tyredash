import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { IVehicleType } from "./vehicle-type.interface";
import { VehicleType } from "./vehicle-type.model";

const createVehicleType = async (
  payload: IVehicleType
): Promise<IVehicleType | null> => {
  const result = await VehicleType.create(payload);
  return result;
};

const getSingleVehicleType = async (
  id: string
): Promise<IVehicleType | null> => {
  const result = await VehicleType.findById(id);
  return result;
};

const getAllVehicleType = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IVehicleType[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await VehicleType.find()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await VehicleType.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateVehicleType = async (
  id: string,
  payload: Partial<IVehicleType>
): Promise<IVehicleType | null> => {
  const result = await VehicleType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteVehicleType = async (id: string): Promise<IVehicleType | null> => {
  const result = await VehicleType.findByIdAndDelete(id);
  return result;
};

export const VehicleTypeService = {
  createVehicleType,
  getSingleVehicleType,
  getAllVehicleType,
  updateVehicleType,
  deleteVehicleType,
};
