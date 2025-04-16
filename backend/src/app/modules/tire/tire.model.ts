import { Schema, Types, model } from "mongoose";
import { ITire, ITireModel } from "./tire.interface";

const TireSchema = new Schema<ITire, ITireModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Schema.Types.ObjectId,
      ref: "Year",
      required: true,
    },
    make: {
      type: Schema.Types.ObjectId,
      ref: "Make",
      required: true,
    },
    model: {
      type: Schema.Types.ObjectId,
      ref: "Model",
      required: true,
    },
    trim: {
      type: Schema.Types.ObjectId,
      ref: "Trim",
      required: true,
    },
    tireSize: {
      type: Schema.Types.ObjectId,
      ref: "TireSize",
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    sectionWidth: {
      type: Number,
      required: true,
    },
    aspectRatio: {
      type: Number,
      required: true,
    },
    rimDiameter: {
      type: Number,
      required: true,
    },
    overallDiameter: {
      type: Number,
      required: true,
    },
    rimWidthRange: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    treadDepth: {
      type: Number,
      required: true,
    },
    loadIndex: {
      type: Number,
      required: true,
    },
    loadRange: {
      type: String,
      required: true,
    },
    maxPSI: {
      type: Number,
      required: true,
    },
    speedRating: {
      type: String,
      required: true,
    },
    sidewallDese: {
      type: String,
      required: true,
    },
    warranty: {
      type: String,
      required: true,
    },
    aspectRatioRange: {
      type: String,
      required: true,
    },
    treadPattern: {
      type: String,
      required: true,
    },
    loadCapacity: {
      type: Number,
      required: true,
    },
    constructionType: {
      type: String,
      required: true,
    },
    tireType: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    diameter: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Tire = model<ITire, ITireModel>("Tire", TireSchema);
