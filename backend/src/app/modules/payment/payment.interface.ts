import { Document, Model, Types } from "mongoose";

export enum PaymentMethod {
  PAYPAL = "paypal",
  CREDIT_CARD = "credit_card",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface IPayment extends Document {
  order: Types.ObjectId;
  user: Types.ObjectId;
  paymentMethod: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  paymentDetails?: any;
}

export type IPaymentModel = Model<IPayment, Record<string, unknown>>;
