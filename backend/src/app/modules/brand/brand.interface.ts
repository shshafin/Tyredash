import { Model } from "mongoose";

export interface IBrand extends Document {
  name: string;
  description?: string;
  logo?: string;
}

export type IBrandModel = Model<IBrand, Record<string, unknown>>;
export type BrandFilters = {
  searchTerm?: string;
};
