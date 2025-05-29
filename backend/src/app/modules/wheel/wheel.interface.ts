import { Model, Types } from "mongoose";

export interface IWheel {
  name: string;
  year: Types.ObjectId;
  make: Types.ObjectId;
  model: Types.ObjectId;
  trim: Types.ObjectId;
  tireSize: Types.ObjectId;
  drivingType: Types.ObjectId;
  brand: Types.ObjectId;
  width: Types.ObjectId;
  ratio: Types.ObjectId;
  diameter: Types.ObjectId;
  vehicleType: Types.ObjectId;
  widthType: Types.ObjectId;
  description: string;
  images: string[];
  category: Types.ObjectId;
  productLine: [string];
  unitName: string;
  grossWeight: string;
  conditionInfo: string;
  GTIN: string;
  ATVOffset: string;
  BoltsQuantity: string;
  wheelColor: string;
  hubBore: string;
  materialType: string;
  wheelSize: string;
  wheelAccent: string;
  wheelPieces: string;
  rimDiameter: number;
  rimWidth: number;
  boltPattern: string;
  offset: number;
  hubBoreSize: number;
  numberOFBolts: number;
  loadCapacity: number;
  loadRating: number;
  finish: string;
  warranty: string;
  constructionType: string;
  wheelType: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
}

export type IWheelModel = Model<IWheel, Record<string, unknown>>;

export interface IWheelFilters {
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
  price?: number;
  stockQuantity?: number;
  constructionType?: string;
  materialType?: string;
  RimDiameter?: number;
  RimWidth?: number;
  width?: string;
  ratio?: string;
  diameter?: string;
  vehicleType?: string;
  widthType?: string;
  [key: string]: any;
}
