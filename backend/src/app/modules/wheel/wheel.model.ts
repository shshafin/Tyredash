import { Schema, Types, model } from "mongoose";
import { IWheel, IWheelModel } from "./wheel.interface";

const WheelSchema = new Schema<IWheel, IWheelModel>(
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
    RimDiameter: {
      type: Number,
      required: true,
    },
    RimWidth: {
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
    category: {
      type: String,
      required: true,
    },
    wheelStockQuantity: {
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

export const Wheel = model<IWheel, IWheelModel>("Wheel", WheelSchema);
