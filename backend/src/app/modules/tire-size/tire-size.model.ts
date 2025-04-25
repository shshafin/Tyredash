import { Schema, Types, model } from "mongoose";
import { ITireSize, ITireSizeModel } from "./tire-size.interface";

const TireSizeSchema = new Schema<ITireSize, ITireSizeModel>(
  {
    tireSize: {
      type: String,
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Indexes
// ModelSchema.index({ name: 1, make: 1, year: 1 }, { unique: true });

export const TireSize = model<ITireSize, ITireSizeModel>(
  "TireSize",
  TireSizeSchema
);
