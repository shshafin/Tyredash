import { Schema, model } from "mongoose";
import { IReview, IReviewModel } from "./review.interface";

const reviewSchema = new Schema<IReview, IReviewModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    productType: { type: String, enum: ["tire", "wheel"], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

export const Review = model<IReview, IReviewModel>("Review", reviewSchema);
