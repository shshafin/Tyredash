// src/models/make.model.ts
import { Schema, Types, model } from "mongoose";
import { IMake, IMakeModel } from "./make.interface";

const MakeSchema = new Schema<IMake, IMakeModel>(
  {
    make: {
      type: String,
      required: true,
      trim: true,
    },
    // year: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Year",
    //   required: true,
    // },
    logo: {
      type: String,
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
// MakeSchema.index({ name: 1, year: 1 }, { unique: true });

// Static method
MakeSchema.statics.isMakeExist = async function (
  make: string
): Promise<IMake | null> {
  return await this.findOne({ make });
};

export const Make = model<IMake, IMakeModel>("Make", MakeSchema);
