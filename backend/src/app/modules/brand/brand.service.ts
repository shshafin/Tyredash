import { IBrand } from "./brand.interface";
import { Brand } from "./brand.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";

const createBrand = async (brandData: IBrand): Promise<IBrand> => {
  const isExist = await Brand.findOne({ name: brandData.name });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Brand already exists");
  }
  const result = await Brand.create(brandData);
  return result;
};

const getAllBrands = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBrand[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: ["name", "description"].map((field) => ({
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

  const result = await Brand.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Brand.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleBrand = async (id: string): Promise<IBrand | null> => {
  const result = await Brand.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
  }
  return result;
};

const updateBrand = async (
  id: string,
  payload: Partial<IBrand>
): Promise<IBrand | null> => {
  const isExist = await Brand.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
  }

  const result = await Brand.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteBrand = async (id: string): Promise<IBrand | null> => {
  const result = await Brand.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
  }
  return result;
};

export const BrandService = {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
};
