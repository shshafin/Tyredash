import { SortOrder } from "mongoose";
import { IFLeetVehicle, IFleetVehicleFilters } from "./vehicle.interface";
import { FleetVehicle } from "./vehicle.model";
import { IPaginationOptions } from "../../../../interfaces/pagination";
import { IGenericResponse } from "../../../../interfaces/common";
import { paginationHelpers } from "../../../../helpers/paginationHelper";
import { fleetVehicleSearchableFields } from "./vehicle.constants";

const createFleetVehicle = async (
  payload: IFLeetVehicle
): Promise<IFLeetVehicle | null> => {
  const existingVehicle = await FleetVehicle.findOne({
    year: payload.year,
    make: payload.make,
    model: payload.model,
    licensePlate: payload.licensePlate,
  });

  if (existingVehicle) {
    throw new Error(
      "A vehicle with the same year, make, model, and license plate already exists"
    );
  }

  const result = await FleetVehicle.create(payload);
  return result;
};
const getSingleFleetVehicle = async (
  id: string
): Promise<IFLeetVehicle | null> => {
  const result = await FleetVehicle.findById(id);
  return result;
};

const getAllFleetVehicles = async (
  filters: IFleetVehicleFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IFLeetVehicle[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: fleetVehicleSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Filters implementation
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await FleetVehicle.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await FleetVehicle.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateFleetVehicle = async (
  id: string,
  payload: Partial<IFLeetVehicle>
): Promise<IFLeetVehicle | null> => {
  const result = await FleetVehicle.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteFleetVehicle = async (
  id: string
): Promise<IFLeetVehicle | null> => {
  const result = await FleetVehicle.findByIdAndDelete(id);
  return result;
};

export const FleetVehicleService = {
  createFleetVehicle,
  getSingleFleetVehicle,
  getAllFleetVehicles,
  updateFleetVehicle,
  deleteFleetVehicle,
};
