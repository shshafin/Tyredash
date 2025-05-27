import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { TireRatioService } from "./tire-ratio.service";

const createTireRatio = catchAsync(async (req: Request, res: Response) => {
  const { ...widhtData } = req.body;
  const result = await TireRatioService.createTireRatio(widhtData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire Ratio created successfully",
    data: result,
  });
});

const getSingleTireRatio = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TireRatioService.getSingleTireRatio(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire Ratio fetched successfully",
    data: result,
  });
});

const getAllTireRatio = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result = await TireRatioService.getAllTireRatio(paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Tire Ratio fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateTireRatio = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TireRatioService.updateTireRatio(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire Ratio updated successfully",
    data: result,
  });
});

const deleteTireRatio = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TireRatioService.deleteTireRatio(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire Ratio deleted successfully",
    data: result,
  });
});

export const TireRatioController = {
  createTireRatio,
  getSingleTireRatio,
  getAllTireRatio,
  updateTireRatio,
  deleteTireRatio,
};
