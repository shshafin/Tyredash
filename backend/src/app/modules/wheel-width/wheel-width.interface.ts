import { Model, Types } from "mongoose";

export interface IWheelWidth {
  width: string;
}

export type IWheelWidhthModel = Model<IWheelWidth, Record<string, unknown>>;
export type IWheelWidthFilters = {
  searchTerm?: string;
};
