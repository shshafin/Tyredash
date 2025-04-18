import { Schema, model } from "mongoose";
import { IOrder, IOrderModel, OrderStatus } from "./order.interface";

const orderSchema = new Schema<IOrder, IOrderModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, required: true },
        productType: { type: String, enum: ["tire", "wheel"], required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: "USA" },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["paypal", "credit_card"],
      required: true,
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  this.itemsPrice = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
  next();
});

export const Order = model<IOrder, IOrderModel>("Order", orderSchema);
