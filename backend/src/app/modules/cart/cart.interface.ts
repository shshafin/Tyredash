import { Document, Model, Types } from "mongoose";

export type CartItem = {
  product: Types.ObjectId;
  productType: "tire" | "wheel";
  quantity: number;
  price: number;
};

export interface ICart extends Document {
  user: Types.ObjectId;
  items: CartItem[];
  totalPrice: number;
}

export type ICartModel = Model<ICart, Record<string, unknown>>;
