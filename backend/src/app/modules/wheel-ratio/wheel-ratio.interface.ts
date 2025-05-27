import { Model } from "mongoose";

export interface IWheelRatio {
  ratio: string;
}

export type IWheelRatioModel = Model<IWheelRatio, Record<string, unknown>>;
export type IWheelRatioFilters = {
  searchTerm?: string;
};
