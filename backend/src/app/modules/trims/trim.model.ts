import { Schema, Types, model } from "mongoose";
import { ITrim, ITrimModel } from "./trim.interface";

const TrimSchema = new Schema<ITrim, ITrimModel>(
  {
    trim: {
      type: String,
      required: true,
      trim: true,
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
    year: {
      type: Schema.Types.ObjectId,
      ref: "Year",
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

// Static method
TrimSchema.statics.isModelExist = async function (
  id: string
): Promise<ITrim | null> {
  return await this.findOne({ id });
};

export const Trim = model<ITrim, ITrimModel>("Trim", TrimSchema);
