import { Document, Model, Types } from "mongoose";
import { ICart } from "../cart/cart.interface";

export type PaymentMethod =
  | "paypal"
  | "stripe"
  | "cash_on_delivery"
  | "bank_transfer"
  | "credit_card"
  | "debit_card";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded"
  | "cancelled";

export interface IPayment {
  user: Types.ObjectId;
  cart: Types.ObjectId | ICart;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  paymentDetails?: any; // For storing gateway-specific details
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export type IPaymentModel = Model<IPayment, Record<string, unknown>>;
