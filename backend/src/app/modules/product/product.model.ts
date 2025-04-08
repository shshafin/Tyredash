import { Schema, Types, model } from "mongoose";
import { IProduct, IProductModel } from "./product.interface";

const ProductSchema = new Schema<IProduct, IProductModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
    },
    stock: {
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
    compatibleVehicles: [
      {
        year: { type: Schema.Types.ObjectId, ref: "Year" },
        make: { type: Schema.Types.ObjectId, ref: "Make" },
        model: { type: Schema.Types.ObjectId, ref: "CarModel" },
        trim: { type: Schema.Types.ObjectId, ref: "Trim" },
      },
    ],
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratings: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, required: true },
        review: { type: String },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
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
