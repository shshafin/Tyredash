import { Document, Types } from "mongoose";

export interface IDeal extends Document {
  title: string;
  description: string;
  image: string;
  discountPercentage: number;
  applicableProducts: ("tire" | "wheel" | "product")[]; // Products the deal applies to (Tire, Wheel, Product)
  brand: Types.ObjectId;
  validFrom: Date;
  validTo: Date;
}

export interface IDealModel extends IDeal {}

export interface IDealFilters {
  searchTerm?: string;
  title?: string;
  description?: string;
  discountPercentage?: number;
  applicableProducts?: string;
  brand?: string;
  validFrom?: string;
  validTo?: string;
}
