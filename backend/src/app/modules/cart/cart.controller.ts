import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ICart } from "./cart.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { cartFilterableFields } from "./cart.constants";
import { CartService } from "./cart.service";

const createCart = catchAsync(async (req: Request, res: Response) => {
  const { ...cartData } = req.body;
  const result = await CartService.createCart(cartData);

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
  const item = req.body;
  const result = await CartService.addItemToCart(userId, item);

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item added to cart successfully",
    data: result,
  });
});

const updateCartItemQuantity = catchAsync(
  async (req: Request, res: Response) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    const result = await CartService.updateCartItemQuantity(
      userId,
      productId,
      quantity
    );

    sendResponse<ICart>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cart item quantity updated successfully",
      data: result,
    });
  }
);

const removeItemFromCart = catchAsync(async (req: Request, res: Response) => {
  const { userId, productId } = req.params;
  const result = await CartService.removeItemFromCart(userId, productId);

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
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
};
