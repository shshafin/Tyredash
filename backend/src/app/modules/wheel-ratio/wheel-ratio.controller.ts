import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { WheelRatioService } from "./wheel-ratio.service";

const createWheelRatio = catchAsync(async (req: Request, res: Response) => {
  const { ...widhtData } = req.body;
  const result = await WheelRatioService.createWheelRatio(widhtData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel Ratio created successfully",
    data: result,
  });
});

const getSingleWheelRatio = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WheelRatioService.getSingleWheelRatio(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel Ratio fetched successfully",
    data: result,
  });
});

const getAllWheelRatio = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result = await WheelRatioService.getAllWheelRatio(paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Wheel Ratio fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateWheelRatio = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WheelRatioService.updateWheelRatio(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel Ratio updated successfully",
    data: result,
  });
});

const deleteWheelRatio = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WheelRatioService.deleteWheelRatio(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel Ratio deleted successfully",
    data: result,
  });
});

export const WheelRatioController = {
  createWheelRatio,
  getSingleWheelRatio,
  getAllWheelRatio,
  updateWheelRatio,
  deleteWheelRatio,
};
