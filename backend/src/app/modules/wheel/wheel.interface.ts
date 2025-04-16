import { Model, Types } from "mongoose";

export interface IWheel extends Document {
  name: string;
  year: Types.ObjectId;
  make: Types.ObjectId;
  model: Types.ObjectId;
  trim: Types.ObjectId;
  tireSize: Types.ObjectId;
  brand: Types.ObjectId;
  RimDiameter: number;
  RimWidth: number;
  boltPattern: string;
  offset: number;
  hubBoreSize: number;
  numberOFBolts: number;
  loadCapacity: number;
  finish: string;
  warranty: string;
  constructionType: string;
  wheelType: string;
  category: string;
  wheelStockQuantity: number;
  price: number;
  stockQuantity: number;
}

export type IWheelModel = Model<IWheel, Record<string, unknown>>;
export type IWheelFilters = {
  searchTerm?: string;
  name?: string;
  boltPattern?: string;
  wheelType?: string;
  category?: string;
  finish?: string;
  brand?: string;
  make?: string;
  model?: string;
  year?: string;
};
