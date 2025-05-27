import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { TireWidthService } from "./tire-width.service";

const createTireWidth = catchAsync(async (req: Request, res: Response) => {
  const { ...widhtData } = req.body;
  const result = await TireWidthService.createTireWidth(widhtData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire width created successfully",
    data: result,
  });
});

const getSingleTireWidth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TireWidthService.getSingleTireWidth(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire width fetched successfully",
    data: result,
  });
});

const getAllTireWidth = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result = await TireWidthService.getAllTireWidth(paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Tire width fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateTireWidth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TireWidthService.updateTireWidth(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire Width updated successfully",
    data: result,
  });
});

const deleteTireWidth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TireWidthService.deleteTireWidth(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire width deleted successfully",
    data: result,
  });
});

export const TireWidthController = {
  createTireWidth,
  getSingleTireWidth,
  getAllTireWidth,
  updateTireWidth,
  deleteTireWidth,
};
