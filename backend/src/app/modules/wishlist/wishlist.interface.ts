import { Document, Model, Types } from "mongoose";

export interface WishlistItem extends Document {
  product: Types.ObjectId;
  productType: "tire" | "wheel" | "product";
}

export interface IWishlist extends Document {
  user: Types.ObjectId;
  items: WishlistItem[];
}

export type IWishlistModel = Model<IWishlist, Record<string, unknown>>;

export type IWishlistFilters = {
  user?: string;
  product?: string;
  productType?: "tire" | "wheel";
};
