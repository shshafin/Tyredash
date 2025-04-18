import { Document, Model, Types } from "mongoose";

export interface IReview extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  productType: "tire" | "wheel";
  rating: number;
  comment?: string;
}

export type IReviewModel = Model<IReview, Record<string, unknown>>;
