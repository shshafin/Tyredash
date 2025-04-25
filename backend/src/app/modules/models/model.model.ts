import { Schema, Types, model } from "mongoose";
import { ICarModel, IModel } from "./model.interface";

const ModelSchema = new Schema<IModel, ICarModel>(
  {
    model: {
      type: String,
      required: true,
      trim: true,
    },
    make: {
      type: Schema.Types.ObjectId,
      ref: "Make",
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
ModelSchema.statics.isModelExist = async function (
  id: string
): Promise<IModel | null> {
  return await this.findOne({ id });
};

export const CarModel = model<IModel, ICarModel>("CarModel", ModelSchema);
