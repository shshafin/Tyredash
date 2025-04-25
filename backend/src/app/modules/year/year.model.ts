// src/models/year.model.ts
import { Schema, Types, model } from "mongoose";
import { IYear, IYearModel } from "./year.interface";

const YearSchema = new Schema<IYear, IYearModel>(
  {
    year: {
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

// Static method
YearSchema.statics.isYearExist = async function (
  year: number
): Promise<IYear | null> {
  return await this.findOne({ year: year });
};

export const Year = model<IYear, IYearModel>("Year", YearSchema);
