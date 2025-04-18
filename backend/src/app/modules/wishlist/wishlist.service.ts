import { IWishlist, WishlistItem } from "./wishlist.interface";
import { Wishlist } from "./wishlist.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

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

const getWishlistByUserId = async (
  userId: string
): Promise<IWishlist | null> => {
  const result = await Wishlist.findOne({ user: userId })
    .populate("user")
    .populate("items.product");
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found");
  }
  return result;
};

const addItemToWishlist = async (
  userId: string,
  item: WishlistItem
): Promise<IWishlist | null> => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found");
  }

  // Check if item already exists in wishlist
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
