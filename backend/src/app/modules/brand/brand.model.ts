import { Schema, Types, model } from "mongoose";
import { IBrand, IBrandModel } from "./brand.interface";

const BrandSchema = new Schema<IBrand, IBrandModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: null,
    },
    logo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Brand = model<IBrand, IBrandModel>("Brand", BrandSchema);
