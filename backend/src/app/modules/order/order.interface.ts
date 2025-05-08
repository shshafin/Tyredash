import { Document, Model, Types } from "mongoose";
import { CartItem } from "../cart/cart.interface";
import { IPayment } from "../payment/payment.interface";

export type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface IOrderItem extends CartItem {
  _id?: Types.ObjectId;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  payment: Types.ObjectId | IPayment;
  items: IOrderItem[];
  totalPrice: number;
  totalItems: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export type IOrderModel = Model<IOrder, Record<string, unknown>>;
