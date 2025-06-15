import { Schema, model, Types } from "mongoose";
import { IDeal } from "./deal.interface";

const DealSchema = new Schema<IDeal>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    applicableProducts: {
      type: [String],
      enum: ["tire", "wheel", "product"], // Specifies if the deal applies to tire, wheel, or general product
    },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const Deal = model<IDeal>("Deal", DealSchema);
