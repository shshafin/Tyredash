import { Document, Model, Types } from "mongoose";

export type WishlistItem = {
  product: Types.ObjectId;
  productType: "tire" | "wheel";
};

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
