import { model, Schema } from "mongoose";
import { ITireRatio, ITireRatioModel } from "./tire-ratio.interface";

const TireRatioSchema = new Schema<ITireRatio, ITireRatioModel>(
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

export const TireRatio = model<ITireRatio, ITireRatioModel>(
  "TireRatio",
  TireRatioSchema
);
