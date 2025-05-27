import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { WheelWidthService } from "./wheel-width.service";

const createWheelWidth = catchAsync(async (req: Request, res: Response) => {
  const { ...widhtData } = req.body;
  const result = await WheelWidthService.createWheelWidth(widhtData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel width created successfully",
    data: result,
  });
});

const getSingleWheelWidth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WheelWidthService.getSingleWheelWidth(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel width fetched successfully",
    data: result,
  });
});

const getAllWheelWidth = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result = await WheelWidthService.getAllWheelWidth(paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Wheel width fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateWheelWidth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WheelWidthService.updateWheelWidth(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel Width updated successfully",
    data: result,
  });
});

const deleteWheelWidth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WheelWidthService.deleteWheelWidth(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "wheel width deleted successfully",
    data: result,
  });
});

export const WheelWidthController = {
  createWheelWidth,
  getSingleWheelWidth,
  getAllWheelWidth,
  updateWheelWidth,
  deleteWheelWidth,
};
