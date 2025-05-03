import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ICart } from "./cart.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { cartFilterableFields } from "./cart.constants";
import { CartService } from "./cart.service";
import { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";

const createCart = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (typeof userId !== "string") {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID must be a string");
  }
  const userIdString: string = userId;
  const objectId = new Types.ObjectId(userIdString);

  const result = await CartService.createCart(objectId);

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart created successfully",
    data: result,
  });
});

const getAllCarts = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cartFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CartService.getAllCarts(filters, paginationOptions);

  sendResponse<ICart[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Carts retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getCartByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await CartService.getCartByUserId(userId);

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart retrieved successfully",
    data: result,
  });
});

const addItemToCart = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { productId, productType, quantity = 1 } = req.body;

  const result = await CartService.addItemToCart(
    userId,
    productId,
    productType,
    quantity
  );

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item added to cart successfully",
    data: result,
  });
});

const updateItemQuantity = catchAsync(async (req: Request, res: Response) => {
  const { userId, productId } = req.params;
  const { productType, quantity } = req.body;

  const result = await CartService.updateItemQuantity(
    userId,
    productId,
    productType,
    quantity
  );

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart item quantity updated successfully",
    data: result,
  });
});

const removeItemFromCart = catchAsync(async (req: Request, res: Response) => {
  const { userId, productId } = req.params;
  const { productType } = req.body;

  const result = await CartService.removeItemFromCart(
    userId,
    productId,
    productType
  );

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item removed from cart successfully",
    data: result,
  });
});

const clearCart = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await CartService.clearCart(userId);

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart cleared successfully",
    data: result,
  });
});

export const CartController = {
  createCart,
  getAllCarts,
  getCartByUserId,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
};
