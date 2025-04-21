import { Model, Types } from "mongoose";

export interface IDrivingType {
  title: string;
  subTitle: string;
  options: string[];
}

export type IDrivingTypeModel = Model<IDrivingType, Record<string, unknown>>;
export type IDrivingTypeFilters = {
  searchTerm?: string;
};
