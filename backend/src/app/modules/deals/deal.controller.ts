import { Request, Response } from "express";
import { DealService } from "./deal.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

// Get discounted tires by brand
const getDiscountedTiresByBrand = catchAsync(
  async (req: Request, res: Response) => {
    const { brandId } = req.params;

    // Get all discounted tires for the brand
    const tires = await DealService.getDiscountedTiresByBrand(brandId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Discounted tires retrieved successfully",
      data: tires,
    });
  }
);

// Get discounted wheels by brand
const getDiscountedWheelsByBrand = catchAsync(
  async (req: Request, res: Response) => {
    const { brandId } = req.params;

    // Get all discounted wheels for the brand
    const wheels = await DealService.getDiscountedWheelsByBrand(brandId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Discounted wheels retrieved successfully",
      data: wheels,
    });
  }
);

// Get discounted products by brand
const getDiscountedProductsByBrand = catchAsync(
  async (req: Request, res: Response) => {
    const { brandId } = req.params;

    // Get all discounted products (simple products) for the brand
    const products = await DealService.getDiscountedProductsByBrand(brandId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Discounted products retrieved successfully",
      data: products,
    });
  }
);

// Apply deal to a tire
const applyDealToTire = catchAsync(async (req: Request, res: Response) => {
  const { tireId } = req.params;
  const updatedTire = await DealService.applyDiscountToTire(tireId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deal applied to tire successfully",
    data: updatedTire,
  });
});

// Apply deal to a wheel
const applyDealToWheel = catchAsync(async (req: Request, res: Response) => {
  const { wheelId } = req.params;
  const updatedWheel = await DealService.applyDiscountToWheel(wheelId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deal applied to wheel successfully",
    data: updatedWheel,
  });
});

// Apply deal to a product
const applyDealToProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const updatedProduct = await DealService.applyDiscountToProduct(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deal applied to product successfully",
    data: updatedProduct,
  });
});

// Create a new deal
const createDeal = catchAsync(async (req: Request, res: Response) => {
  const dealData = req.body;

  const result = await DealService.createDeal(dealData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Deal created successfully",
    data: result,
  });
});

export const DealController = {
  createDeal,
  getDiscountedTiresByBrand,
  getDiscountedWheelsByBrand,
  getDiscountedProductsByBrand,
  applyDealToTire,
  applyDealToWheel,
  applyDealToProduct,
};
