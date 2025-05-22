import mongoose, { Schema, Document } from "mongoose";
import { Deal } from "./deal.interface";

const dealSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    discountAmount: { type: Number, required: true },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    applicableBrands: [{ type: String }],
    termsAndConditions: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const DealModel = mongoose.model<Deal & Document>("Deal", dealSchema);

export default DealModel;

// import { Schema, model, Types } from 'mongoose';

// const dealSchema = new Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     startDate: { type: Date, required: true },
//     endDate: { type: Date, required: true },
//     discountAmount: { type: Number, required: true },
//     discountType: {
//       type: String,
//       enum: ['percentage', 'fixed'],
//       required: true,
//     },
//     applicableBrands: [{ type: Types.ObjectId, ref: 'Brand' }],
//     applicableProducts: [{ type: Types.ObjectId, refPath: 'productType' }],
//     productType: {
//       type: String,
//       enum: ['Tire', 'Wheel', 'Product'],
//       required: true,
//     },
//     termsAndConditions: { type: String, required: true },
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// const Deal = model('Deal', dealSchema);

// export default Deal;
