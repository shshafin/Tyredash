import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { WishlistService } from "./wishlist.service";
import { IWishlist } from "./wishlist.interface";

const createWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await WishlistService.createWishlist(userId);

  sendResponse<IWishlist>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Wishlist created successfully",
    data: result,
  });
});

const getMyWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await WishlistService.getWishlistByUserId(userId);

  sendResponse<IWishlist>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wishlist retrieved successfully",
    data: result,
  });
});

const addItemToWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const item = req.body;

  // Check if product type is valid
  if (!["tire", "wheel", "product"].includes(item.productType)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid product type",
    });
  }

  const result = await WishlistService.addItemToWishlist(userId, item);

  sendResponse<IWishlist>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item added to wishlist successfully",
    data: result,
  });
});

const removeItemFromWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { productId } = req.params;
    const result = await WishlistService.removeItemFromWishlist(
      userId,
      productId
    );

    sendResponse<IWishlist>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Item removed from wishlist successfully",
      data: result,
    });
  }
);

const clearWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await WishlistService.clearWishlist(userId);

  sendResponse<IWishlist>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wishlist cleared successfully",
    data: result,
  });
});

export const WishlistController = {
  createWishlist,
  getMyWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  clearWishlist,
};
