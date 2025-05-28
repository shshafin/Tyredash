import { model, Schema } from "mongoose";
import {
  IWheelWidthType,
  IWheelWidthTypeModel,
} from "./wheel-width-type.interface";

const WheelWidthTypeSchema = new Schema<IWheelWidthType, IWheelWidthTypeModel>(
  {
    widthType: {
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

export const WheelWidthType = model<IWheelWidthType, IWheelWidthTypeModel>(
  "WheelWidthType",
  WheelWidthTypeSchema
);
