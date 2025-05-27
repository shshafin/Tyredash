import { Model, Types } from "mongoose";

export interface IWheelDiameter {
  diameter: string;
}

export type IWheelDiameterModel = Model<
  IWheelDiameter,
  Record<string, unknown>
>;
export type IWheelDiameterFilters = {
  searchTerm?: string;
};
