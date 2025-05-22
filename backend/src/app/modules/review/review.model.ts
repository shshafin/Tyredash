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
    productType: {
      type: String,
      enum: ["tire", "wheel", "product"],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Prevent duplicate reviews from same user for same product
reviewSchema.index({ user: 1, product: 1, productType: 1 }, { unique: true });

export const Review = model<IReview, IReviewModel>("Review", reviewSchema);
