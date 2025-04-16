import { Model, Types } from "mongoose";

export interface ITire {
  name: string;
  year: Types.ObjectId;
  make: Types.ObjectId;
  model: Types.ObjectId;
  trim: Types.ObjectId;
  tireSize: Types.ObjectId;
  brand: Types.ObjectId;
  sectionWidth: number;
  aspectRatio: number;
  rimDiameter: number;
  overallDiameter: number;
  rimWidthRange: number;
  width: number;
  treadDepth: number;
  loadIndex: number;
  loadRange: string;
  maxPSI: number;
  speedRating: string;
  sidewallDese: string;
  warranty: string;
  aspectRatioRange: string;
  treadPattern: string;
  loadCapacity: number;
  constructionType: string;
  tireType: string;
  category: string;
  diameter: number;
  price: number;
  stockQuantity: number;
}

export type ITireModel = Model<ITire, Record<string, unknown>>;

export type ITireFilters = {
  searchTerm?: string;
  name?: string;
  loadRange?: string;
  speedRating?: string;
  tireType?: string;
  category?: string;
  brand?: string;
  make?: string;
  model?: string;
  year?: string;
};
