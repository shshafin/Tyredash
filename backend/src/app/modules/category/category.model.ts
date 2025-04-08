import { Schema, Types, model } from "mongoose";
import { ICategory, ICategoryModel } from "./category.interface";

const CategorySchema = new Schema<ICategory, ICategoryModel>(
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
      default: "",
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Index for slug (ensure uniqueness)
CategorySchema.index({ name: 1, slug: 1 }, { unique: true });

export const Category = model<ICategory, ICategoryModel>(
  "Category",
  CategorySchema
);
