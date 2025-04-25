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

// Static method
TrimSchema.statics.isModelExist = async function (
  id: string
): Promise<ITrim | null> {
  return await this.findOne({ id });
};

export const Trim = model<ITrim, ITrimModel>("Trim", TrimSchema);
