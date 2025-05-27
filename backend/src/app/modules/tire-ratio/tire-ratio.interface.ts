import { Model, Types } from "mongoose";

export interface ITireRatio {
  ratio: string;
}

export type ITireRatioModel = Model<ITireRatio, Record<string, unknown>>;
export type ITireRatioFilters = {
  searchTerm?: string;
};
