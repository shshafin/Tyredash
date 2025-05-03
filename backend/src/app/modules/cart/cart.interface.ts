import { Model, Types } from "mongoose";

export type ProductType = "tire" | "wheel" | "product";

export interface CartItem {
  product: Types.ObjectId;
  productType: ProductType;
  quantity: number;
  price: number;
  name: string;
  thumbnail?: string;
}

export interface ICart {
  user: Types.ObjectId;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export type ICartModel = Model<ICart, Record<string, unknown>>;
