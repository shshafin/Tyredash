import { Request, Response } from "express";
import { DealService } from "./deal.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { dealFilterableFields } from "./deal.constant";

// ADMIN CONTROLLERS
const createDeal = catchAsync(async (req: Request, res: Response) => {
  const result = await DealService.createDeal(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Deal created successfully",
    data: result,
  });
});

const updateDeal = catchAsync(async (req: Request, res: Response) => {
  const result = await DealService.updateDeal(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deal updated successfully",
    data: result,
  });
});

const deleteDeal = catchAsync(async (req: Request, res: Response) => {
  await DealService.deleteDeal(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deal deleted successfully",
    data: null,
  });
});

const getSingleDeal = catchAsync(async (req: Request, res: Response) => {
  const result = await DealService.getDealById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deal retrieved successfully",
    data: result,
  });
});

const getAllDeals = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, dealFilterableFields);
  const result = await DealService.getAllDeals(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deals retrieved successfully",
    data: result,
  });
});

// CUSTOMER CONTROLLERS
const getActiveDeals = catchAsync(async (req: Request, res: Response) => {
  const result = await DealService.getActiveDeals(req.query.brand as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Active deals retrieved successfully",
    data: result,
  });
});

const getDiscountedItems = catchAsync(async (req: Request, res: Response) => {
  const { brandId, collection } = req.params;
  const result = await DealService.getDiscountedItems(
    brandId,
    collection as "tires" | "wheels" | "products"
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Discounted items retrieved successfully",
    data: result,
  });
});

export const DealController = {
  createDeal,
  updateDeal,
  deleteDeal,
  getSingleDeal,
  getAllDeals,
  getActiveDeals,
  getDiscountedItems,
};
