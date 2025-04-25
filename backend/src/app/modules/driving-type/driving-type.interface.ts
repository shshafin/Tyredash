import { Model, Types } from "mongoose";

export interface IDrivingType {
  title: string;
  subTitle: string;
  options: string[];
}

export type IDrivingTypeModel = Model<IDrivingType, Record<string, unknown>>;

export interface IDrivingTypeFilters {
  searchTerm?: string;
  title?: string;
  subTitle?: string;
  options?: string[];
}
