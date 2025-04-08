import { Model, Types } from "mongoose";

export interface IYear {
  year: number;
  // makes: Types.ObjectId[];
}
export type IYearModel = Model<IYear, Record<string, unknown>>;
export type IYearFilters = {
  searchTerm?: string;
};
