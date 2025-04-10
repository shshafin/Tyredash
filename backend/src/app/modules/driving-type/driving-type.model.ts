import { Schema, model } from "mongoose";
import { IDrivingType, IDrivingTypeModel } from "./driving-type.interface";

const DrivingTypeSchema = new Schema<IDrivingType, IDrivingTypeModel>(
  {
    title: {
      type: String,
      required: true,
    },
    subTItle: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
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

export const DrivingType = model<IDrivingType, IDrivingTypeModel>(
  "DrivingType",
  DrivingTypeSchema
);
