import { Schema, model } from "mongoose";
import { IPayment, IPaymentModel } from "./payment.interface";

const paymentSchema = new Schema<IPayment, IPaymentModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: [
        "paypal",
        "stripe",
        "cash_on_delivery",
        "bank_transfer",
        "credit_card",
        "debit_card",
      ],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "cancelled",
      ],
      default: "pending",
    },
    transactionId: {
      type: String,
    },
    paymentDetails: {
      type: Schema.Types.Mixed,
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Payment = model<IPayment, IPaymentModel>("Payment", paymentSchema);
