import { Document, Model, Types } from "mongoose";

export type OrderItem = {
  product: Types.ObjectId;
  productType: "tire" | "wheel";
  quantity: number;
  price: number;
};

export type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: "paypal" | "credit_card";
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: OrderStatus;
  paidAt?: Date;
  deliveredAt?: Date;
}

export type IOrderModel = Model<IOrder, Record<string, unknown>>;
