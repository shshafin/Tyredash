interface ProductSpecification {
  key: string;
  value: string;
}

import { Document, Model, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  sku: string;
  images: string[];
  thumbnail: string;
  category: Types.ObjectId;
  brand?: Types.ObjectId;
}

export type IProductModel = Model<IProduct, Record<string, unknown>>;
export type IProductFilters = {
  searchTerm?: string;
};
