import { Model, Types } from "mongoose";

export interface ITireWidth {
  width: string;
}

export type ITireWidhthModel = Model<ITireWidth, Record<string, unknown>>;
export type ITireWidthFilters = {
  searchTerm?: string;
};
