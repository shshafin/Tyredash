import { Request, Response } from "express";
import { DealService } from "./deal.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { Deal } from "./deal.model";
import { deleteFile, getFileUrl } from "../../../helpers/fileHandlers";
import ApiError from "../../../errors/ApiError";
import { IDeal } from "./deal.interface";
import pick from "../../../shared/pick";
import { dealFilterableFields } from "./deals.constant";
import { paginationFields } from "../../../constants/pagination";

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
  const { ...dealData } = req.body;

  const existingDeals = await Deal.findOne({
    title: dealData.title,
  });

  if (existingDeals) {
    if (req.file) {
      deleteFile(req.file.filename);
    }
    throw new ApiError(httpStatus.BAD_REQUEST, "Deals already exists");
  }

  if (req.file) {
    dealData.image = getFileUrl(req.file.filename);
  }

  const result = await DealService.createDeal(dealData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Deal created successfully",
    data: result,
  });
});

const getAllDeals = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, dealFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await DealService.getAllDeals(filters, paginationOptions);

  sendResponse<IDeal[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deals retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateDeal = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...payload } = req.body;

  const existingDeal = await Deal.findById(id);
  if (!existingDeal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Deal not found!");
  }

  if (req.file) {
    if (existingDeal.image) {
      const oldFilename = existingDeal.image.split("/").pop();
      deleteFile(oldFilename ?? "");
    }
    payload.image = getFileUrl(req.file.filename);
  }

  const result = await DealService.updateDeal(id, payload);

  sendResponse<IDeal>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deal updated successfully",
    data: result,
  });
});

const deleteDeal = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deal = await Deal.findById(id);
  if (!deal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Deal not found");
  }

  if (deal.image) {
    const filename = deal.image.split("/").pop();
    deleteFile(filename ?? "");
  }

  const result = await DealService.deleteDeal(id);

  sendResponse<IDeal>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deal deleted successfully",
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
  getAllDeals,
  updateDeal,
  deleteDeal,
};
