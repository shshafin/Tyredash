import { Schema, model } from "mongoose";
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
      ref: "CarModel",
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
    drivingType: {
      type: Schema.Types.ObjectId,
      ref: "DrivingType",
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    productLine: {
      type: String,
    },
    unitName: {
      type: String,
    },
    conditionInfo: {
      type: String,
    },
    grossWeightRange: {
      type: String,
    },
    gtinRange: {
      type: String,
    },
    loadIndexRange: {
      type: String,
    },
    mileageWarrantyRange: {
      type: String,
    },
    maxAirPressureRange: {
      type: String,
    },
    speedRatingRange: {
      type: String,
    },
    sidewallDescriptionRange: {
      type: String,
    },
    temperatureGradeRange: {
      type: String,
    },
    sectionWidthRange: {
      type: String,
    },
    diameterRange: {
      type: Number,
    },
    wheelRimDiameterRange: {
      type: String,
    },
    tractionGradeRange: {
      type: String,
    },
    treadDepthRange: {
      type: String,
    },
    treadWidthRange: {
      type: String,
    },
    overallWidthRange: {
      type: String,
    },
    treadwearGradeRange: {
      type: String,
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Add text index for search
TireSchema.index({
  name: "text",
  description: "text",
  tireType: "text",
  constructionType: "text",
});

export const Tire = model<ITire, ITireModel>("Tire", TireSchema);
