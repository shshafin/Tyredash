interface ProductSpecification {
  key: string;
  value: string;
}

import { Document, Model, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  sku: string;
  images: string[];
  thumbnail: string;
  category: Types.ObjectId;
  compatibleVehicles: {
    year?: Types.ObjectId;
    make?: Types.ObjectId;
    model?: Types.ObjectId;
    trim?: Types.ObjectId;
  }[];
  // specifications: ProductSpecification[];
  brand?: Types.ObjectId;
  ratings?: {
    userId: Types.ObjectId;
    value: number;
    review?: string;
  }[];
  averageRating?: number;
}

export type IProductModel = Model<IProduct, Record<string, unknown>>;
export type IProductFilters = {
  searchTerm?: string;
};
