import { Schema, model } from "mongoose";
import { IWheel, IWheelModel } from "./wheel.interface";

const WheelSchema = new Schema<IWheel, IWheelModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    drivingType: {
      type: Schema.Types.ObjectId,
      ref: "DrivingType",
      required: true,
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
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    width: {
      type: Schema.Types.ObjectId,
      ref: "WheelWidth",
    },
    ratio: {
      type: Schema.Types.ObjectId,
      ref: "WheelRatio",
    },
    diameter: {
      type: Schema.Types.ObjectId,
      ref: "WheelDiameter",
    },
    vehicleType: {
      type: Schema.Types.ObjectId,
      ref: "VehicleType",
    },
    widthType: {
      type: Schema.Types.ObjectId,
      ref: "WheelWidthType",
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
      type: [String],
      default: [],
    },
    unitName: {
      type: String,
    },
    grossWeight: {
      type: String,
    },
    conditionInfo: {
      type: String,
    },
    GTIN: {
      type: String,
    },
    ATVOffset: {
      type: String,
    },
    BoltsQuantity: {
      type: String,
    },
    wheelColor: {
      type: String,
    },
    hubBore: {
      type: String,
    },
    materialType: {
      type: String,
    },
    wheelSize: {
      type: String,
    },
    wheelAccent: {
      type: String,
    },
    wheelPieces: {
      type: String,
    },
    rimDiameter: {
      type: Number,
      required: true,
    },
    rimWidth: {
      type: Number,
      required: true,
    },
    boltPattern: {
      type: String,
      required: true,
    },
    offset: {
      type: Number,
      required: true,
    },
    hubBoreSize: {
      type: Number,
      required: true,
    },
    numberOFBolts: {
      type: Number,
      required: true,
    },
    loadCapacity: {
      type: Number,
      required: true,
    },
    loadRating: {
      type: Number,
    },
    finish: {
      type: String,
      required: true,
    },
    warranty: {
      type: String,
      required: true,
    },
    constructionType: {
      type: String,
      required: true,
    },
    wheelType: {
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
WheelSchema.index({
  name: "text",
  description: "text",
  wheelType: "text",
  constructionType: "text",
});

export const Wheel = model<IWheel, IWheelModel>("Wheel", WheelSchema);
