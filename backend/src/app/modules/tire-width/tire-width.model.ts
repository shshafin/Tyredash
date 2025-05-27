import { model, Schema } from "mongoose";
import { ITireWidhthModel, ITireWidth } from "./tire-width.interface";

const TireWidthSchema = new Schema<ITireWidth, ITireWidhthModel>(
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

export const TireWidth = model<ITireWidth, ITireWidhthModel>(
  "TireWidth",
  TireWidthSchema
);
