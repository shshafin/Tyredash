import { Document, Types } from "mongoose";

export interface IDealDeep extends Document {
  title: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  brand: Types.ObjectId;
  applyTo: {
    tires: boolean;
    wheels: boolean;
    products: boolean;
  };
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type DealApplicableCollections = "tires" | "wheels" | "products";
