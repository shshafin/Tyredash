import { Schema, Types, model } from "mongoose";
import { IProduct, IProductModel } from "./product.interface";

const ProductSchema = new Schema<IProduct, IProductModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    images: [String],
    thumbnail: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Calculate average rating
ProductSchema.methods.calculateAverageRating = function () {
  if (this.ratings && this.ratings.length > 0) {
    const totalRating: number = this.ratings.reduce(
      (acc: number, rating: { value: number }): number => acc + rating.value,
      0
    );
    this.averageRating = totalRating / this.ratings.length;
  }
};

// Index for product name and slug
ProductSchema.index({ name: 1, slug: 1 }, { unique: true });

export const Product = model<IProduct, IProductModel>("Product", ProductSchema);
