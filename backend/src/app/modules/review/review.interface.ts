import { Document, Model, Types } from "mongoose";

export interface IReview extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  productType: "tire" | "wheel" | "product";
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPreview {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email?: string;
  avatar?: string;
}

export interface IPopulatedReview extends Omit<IReview, "user"> {
  user: IUserPreview;
}

export interface IReviewStats {
  averageRating: number;
  reviewCount: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface IProductWithReviews<T = any> {
  product: T;
  reviews: IPopulatedReview[];
  stats: IReviewStats;
}

export type IReviewModel = Model<IReview, Record<string, unknown>>;
