import { model, Schema } from "mongoose";
import { IWheelWidhthModel, IWheelWidth } from "./wheel-width.interface";

const WheelWidthSchema = new Schema<IWheelWidth, IWheelWidhthModel>(
  {
    width: {
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

export const WheelWidth = model<IWheelWidth, IWheelWidhthModel>(
  "WheelWidth",
  WheelWidthSchema
);
