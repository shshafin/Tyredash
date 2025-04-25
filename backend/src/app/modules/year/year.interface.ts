import { Model, Types } from "mongoose";

export interface IYear {
  year: number;
}
export type IYearModel = Model<IYear, Record<string, unknown>>;
export type IYearFilters = {
  searchTerm?: string;
};
