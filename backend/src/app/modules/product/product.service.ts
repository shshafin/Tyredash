import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";

const createProduct = async (payload: IProduct): Promise<IProduct | null> => {
  const result = await Product.create(payload);
  return result;
};

const getSingleProduct = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findById(id)
    .populate("category")
    .populate("compatibleVehicles.year")
    .populate("compatibleVehicles.make")
    .populate("compatibleVehicles.model")
    .populate("compatibleVehicles.trim")
    .populate("brand");
  return result;
};

const getAllProducts = async (
  filters: { searchTerm?: string },
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IProduct[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (filters.searchTerm) {
    andConditions.push({
      $or: [
        { name: { $regex: filters.searchTerm, $options: "i" } },
        { slug: { $regex: filters.searchTerm, $options: "i" } },
      ],
    });
  }

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Product.find(
    andConditions.length > 0 ? { $and: andConditions } : {}
  )
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(
    andConditions.length > 0 ? { $and: andConditions } : {}
  );

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateProduct = async (
  id: string,
  payload: Partial<IProduct>
): Promise<IProduct | null> => {
  const result = await Product.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const deleteProduct = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

export const ProductService = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
