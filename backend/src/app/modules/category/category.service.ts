import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";

const createCategory = async (
  payload: ICategory
): Promise<ICategory | null> => {
  const result = await Category.create(payload);
  return result;
};

const getSingleCategory = async (id: string): Promise<ICategory | null> => {
  const result = await Category.findById(id);
  return result;
};

const getAllCategories = async (
  filters: { searchTerm?: string },
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICategory[]>> => {
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
  const result = await Category.find(
    andConditions.length > 0 ? { $and: andConditions } : {}
  )
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Category.countDocuments(
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

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>
): Promise<ICategory | null> => {
  const result = await Category.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteCategory = async (id: string): Promise<ICategory | null> => {
  const result = await Category.findByIdAndDelete(id);
  return result;
};

export const CategoryService = {
  createCategory,
  getSingleCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
