import { Model, Types } from "mongoose";

export interface IModel {
  model: string;
  make: Types.ObjectId;
  year: number | Types.ObjectId;
  // trims: Types.ObjectId[];
}

export type ICarModel = Model<IModel, Record<string, unknown>>;
export type ICarFilters = {
  searchTerm?: string;
};

export interface IModelFilters {
  searchTerm?: string;
  model?: string;
  make?: Types.ObjectId | string;
  year?: Types.ObjectId | string;
}
