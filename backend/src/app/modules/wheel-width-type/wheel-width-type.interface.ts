import { Model, Types } from "mongoose";

export interface IWheelWidthType {
  widthType: string;
}

export type IWheelWidthTypeModel = Model<
  IWheelWidthType,
  Record<string, unknown>
>;
export type IWheelWidthTypeFilters = {
  searchTerm?: string;
};
