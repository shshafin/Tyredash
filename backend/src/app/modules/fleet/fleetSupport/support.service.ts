import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../../interfaces/common";
import { IPaginationOptions } from "../../../../interfaces/pagination";
import { fleetSupportSearchableFields } from "./support.constants";
import { IFleetSupport } from "./support.interface";
import { FleetSupport } from "./support.model";
import ApiError from "../../../../errors/ApiError";
import httpStatus from "http-status";
import { deleteFile } from "../../../../helpers/fileHandlers";

const createFleetSupport = async (
  payload: IFleetSupport
): Promise<IFleetSupport> => {
  const result = await FleetSupport.create(payload);
  return result;
};

const getAllFleetSupports = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IFleetSupport[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: fleetSupportSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

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

  const result = await FleetSupport.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await FleetSupport.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleFleetSupport = async (
  id: string
): Promise<IFleetSupport | null> => {
  const result = await FleetSupport.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet support request not found");
  }
  return result;
};

const updateFleetSupport = async (
  id: string,
  payload: Partial<IFleetSupport>
): Promise<IFleetSupport | null> => {
  const isExist = await FleetSupport.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet support request not found");
  }

  const result = await FleetSupport.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteFleetSupport = async (
  id: string
): Promise<IFleetSupport | null> => {
  const result = await FleetSupport.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet support request not found");
  }

  if (result.files && result.files.length > 0) {
    await Promise.allSettled(
      result.files.map(async (fileUrl) => {
        const filename = fileUrl.split("/").pop();
        if (filename) {
          await deleteFile(filename);
        }
      })
    );
  }

  return result;
};

export const FleetSupportService = {
  createFleetSupport,
  getAllFleetSupports,
  getSingleFleetSupport,
  updateFleetSupport,
  deleteFleetSupport,
};
