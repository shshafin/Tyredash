import { Model, Types } from "mongoose";

export interface ITrim extends Document {
  trim: string;
  year: Types.ObjectId;
  make: Types.ObjectId;
  model: Types.ObjectId;
  // categories: Types.ObjectId[];
  tireSize?: string;
  wheelSize?: string;
}

export type ITrimModel = Model<ITrim, Record<string, unknown>>;

export interface ITrimFilters {
  searchTerm?: string;
  trim?: string;
  make?: Types.ObjectId | string;
  model?: Types.ObjectId | string;
  year?: Types.ObjectId | string;
}
