import { Model, Types } from "mongoose";

export interface ITire {
  name: string;
  year: Types.ObjectId;
  make: Types.ObjectId;
  model: Types.ObjectId;
  trim: Types.ObjectId;
  tireSize: Types.ObjectId;
  brand: Types.ObjectId;
  category: Types.ObjectId;
  description: string;
  images: string[];
  productLine: string;
  unitName: string;
  conditionInfo: string;
  grossWeightRange: string;
  gtinRange: string;
  loadIndexRange: string;
  mileageWarrantyRange: string;
  maxAirPressureRange: string;
  speedRatingRange: string;
  sidewallDescriptionRange: string;
  temperatureGradeRange: string;
  sectionWidthRange: string;
  diameterRange: number;
  wheelRimDiameterRange: string;
  tractionGradeRange: string;
  treadDepthRange: string;
  treadWidthRange: string;
  overallWidthRange: string;
  treadwearGradeRange: string;
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
  warranty: string;
  aspectRatioRange: string;
  treadPattern: string;
  loadCapacity: number;
  constructionType: string;
  tireType: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
}

export type ITireModel = Model<ITire, Record<string, unknown>>;

export interface ITireFilters {
  searchTerm?: string;
  name?: string;
  loadRange?: string;
  tireType?: string;
  category?: string;
  brand?: string;
  make?: string;
  model?: string;
  year?: string;
  price?: number;
  stockQuantity?: number;
  constructionType?: string;
  sectionWidth?: number;
  aspectRatio?: number;
  rimDiameter?: number;
  [key: string]: any;
}
