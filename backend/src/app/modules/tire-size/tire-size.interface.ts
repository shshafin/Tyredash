import { Model, Types } from "mongoose";

export interface ITireSize extends Document {
  tireSize: string;
  year: Types.ObjectId;
  make: Types.ObjectId;
  model: Types.ObjectId;
  trim: Types.ObjectId;
}

export type ITireSizeModel = Model<ITireSize, Record<string, unknown>>;
export type ITireSizeFilters = {
  searchTerm?: string;
};
