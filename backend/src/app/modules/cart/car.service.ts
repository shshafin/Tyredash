import { CartItem, ICart } from "./cart.interface";
import { Cart } from "./cart.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";

import { cartFilterableFields } from "./cart.constants";

const createCart = async (cartData: ICart): Promise<ICart> => {
  const isExist = await Cart.findOne({ user: cartData.user });
  if (isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cart already exists for this user"
    );
  }
  const result = await Cart.create(cartData);
  return result;
};

const getAllCarts = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICart[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: cartFilterableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Cart.find(whereConditions)
    .populate("user")
    .populate("items.product")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Cart.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getCartByUserId = async (userId: string): Promise<ICart | null> => {
  const result = await Cart.findOne({ user: userId })
    .populate("user")
    .populate("items.product");
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }
  return result;
};

const addItemToCart = async (
  userId: string,
  item: CartItem
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  const existingItemIndex = cart.items.findIndex(
    (cartItem) => cartItem.product.toString() === item.product.toString()
  );

  if (existingItemIndex !== -1) {
    cart.items[existingItemIndex].quantity += item.quantity;
  } else {
    cart.items.push(item);
  }

  await cart.save();
  return cart;
};

const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found in cart");
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  return cart;
};

const removeItemFromCart = async (
  userId: string,
  productId: string
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );
  await cart.save();
  return cart;
};

const clearCart = async (userId: string): Promise<ICart | null> => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { items: [], totalPrice: 0 },
    { new: true }
  );
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }
  return cart;
};

export const CartService = {
  createCart,
  getAllCarts,
  getCartByUserId,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
};
