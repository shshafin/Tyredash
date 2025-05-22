import { IWishlist, WishlistItem } from "./wishlist.interface";
import { Wishlist } from "./wishlist.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { Types } from "mongoose";

const createWishlist = async (userId: string): Promise<IWishlist> => {
  const isExist = await Wishlist.findOne({ user: userId });
  if (isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Wishlist already exists for this user"
    );
  }
  const result = await Wishlist.create({ user: userId, items: [] });
  return result;
};

// const getWishlistByUserId = async (
//   userId: string
// ): Promise<IWishlist | null> => {
//   const result = await Wishlist.findOne({ user: userId })
//     .populate("user")
//     .populate("items.product");

//   console.log("items data", result?.items);

//   if (!result) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found");
//   }
//   return result;
// };

const getWishlistByUserId = async (
  userId: string
): Promise<IWishlist | null> => {
  // First fetch the wishlist with user populated
  const wishlist = await Wishlist.findOne({ user: userId })
    .populate("user")
    .lean()
    .exec();

  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found");
  }

  // Manually populate each product based on its type
  const populatedItems = await Promise.all(
    wishlist.items.map(async (item) => {
      let populatedProduct: Types.ObjectId | Document | null = item.product;

      try {
        switch (item.productType) {
          case "tire":
            populatedProduct = await mongoose
              .model("Tire")
              .findById(item.product);
            break;
          case "wheel":
            populatedProduct = await mongoose
              .model("Wheel")
              .findById(item.product);
            break;
          case "product":
            populatedProduct = await mongoose
              .model("Product")
              .findById(item.product);
            break;
        }
      } catch (error) {
        console.error(`Error populating product ${item.product}:`, error);
      }

      return {
        ...item,
        product:
          populatedProduct &&
          typeof (populatedProduct as any).toObject === "function"
            ? (populatedProduct as any).toObject()
            : item.product,
      };
    })
  );

  return {
    ...wishlist,
    items: populatedItems,
  } as unknown as IWishlist; // Type assertion to handle lean transformation
};

const addItemToWishlist = async (
  userId: string,
  item: WishlistItem
): Promise<IWishlist | null> => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      items: [],
    });
  }

  if (!["tire", "wheel", "product"].includes(item.productType)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid product type");
  }

  const itemExists = wishlist.items.some(
    (wishlistItem) =>
      wishlistItem.product.toString() === item.product.toString()
  );

  if (itemExists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Item already exists in wishlist"
    );
  }

  wishlist.items.push(item);
  await wishlist.save();
  return wishlist;
};

const removeItemFromWishlist = async (
  userId: string,
  productId: string
): Promise<IWishlist | null> => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found");
  }

  wishlist.items = wishlist.items.filter(
    (item) => item.product.toString() !== productId
  );
  await wishlist.save();
  return wishlist;
};

const clearWishlist = async (userId: string): Promise<IWishlist | null> => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { items: [] },
    { new: true }
  );
  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found");
  }
  return wishlist;
};

export const WishlistService = {
  createWishlist,
  getWishlistByUserId,
  addItemToWishlist,
  removeItemFromWishlist,
  clearWishlist,
};
