import { Model, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parentCategory?: Types.ObjectId;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ICategoryModel = Model<ICategory, Record<string, unknown>>;
export type ICategoryFilters = {
  searchTerm?: string;
};
