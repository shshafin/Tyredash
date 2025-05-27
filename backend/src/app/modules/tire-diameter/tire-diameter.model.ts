import { model, Schema } from "mongoose";
import { ITireDiameter, ITireDiameterModel } from "./tire-diameter.interface";

const TireDiameterSchema = new Schema<ITireDiameter, ITireDiameterModel>(
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

export const TireDiameter = model<ITireDiameter, ITireDiameterModel>(
  "TireDiameter",
  TireDiameterSchema
);
