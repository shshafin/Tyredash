import { Schema, model } from "mongoose";
import { IOrder, IOrderModel } from "./order.interface";

const orderSchema = new Schema<IOrder, IOrderModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          refPath: "items.productType",
        },
        productType: {
          type: String,
          enum: ["tire", "wheel", "product"],
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        thumbnail: {
          type: String,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalItems: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    billingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    trackingNumber: {
      type: String,
    },
    estimatedDelivery: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Add index for frequently queried fields
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = model<IOrder, IOrderModel>("Order", orderSchema);
