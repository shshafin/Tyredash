import { model, Schema } from "mongoose";
import {
  IWheelDiameter,
  IWheelDiameterModel,
} from "./wheel-diameter.interface";

const WheelDiameterSchema = new Schema<IWheelDiameter, IWheelDiameterModel>(
  {
    diameter: {
      type: String,
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

export const WheelDiameter = model<IWheelDiameter, IWheelDiameterModel>(
  "WheelDiameter",
  WheelDiameterSchema
);
