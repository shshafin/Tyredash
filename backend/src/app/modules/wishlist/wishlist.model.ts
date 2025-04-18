import { Schema, model } from "mongoose";
import { IWishlist, IWishlistModel } from "./wishlist.interface";

const wishlistSchema = new Schema<IWishlist, IWishlistModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, required: true },
        productType: { type: String, enum: ["tire", "wheel"], required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Wishlist = model<IWishlist, IWishlistModel>(
  "Wishlist",
  wishlistSchema
);
