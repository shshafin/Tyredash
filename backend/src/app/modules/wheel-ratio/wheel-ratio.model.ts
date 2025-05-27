import { model, Schema } from "mongoose";
import { IWheelRatio, IWheelRatioModel } from "./wheel-ratio.interface";

const WheelRatioSchema = new Schema<IWheelRatio, IWheelRatioModel>(
  {
    ratio: {
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

export const WheelRatio = model<IWheelRatio, IWheelRatioModel>(
  "WheelRatio",
  WheelRatioSchema
);
