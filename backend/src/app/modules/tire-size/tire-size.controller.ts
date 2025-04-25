import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";

import { ITireSize } from "./tire-size.interface";
import { TireService } from "./tire-size-service";
import { tireSizeFilterableFields } from "./tire-size.constants";

const createTireSize = catchAsync(async (req: Request, res: Response) => {
  const { ...trimData } = req.body;
  const result = await TireService.createTireSize(trimData);

  sendResponse<ITireSize>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "tire size created successfully",
    data: result,
  });
});

const getSingleTireSize = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TireService.getSingleTireSize(id);

  sendResponse<ITireSize>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "tire size fetched successfully",
    data: result,
  });
});

const getAllTireSizes = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, tireSizeFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await TireService.getAllTireSizes(paginationOptions, filters);

  sendResponse<ITireSize[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire size fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateTireSize = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TireService.updateTireSize(id, req.body);

  sendResponse<ITireSize>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire size updated successfully",
    data: result,
  });
});

const deleteTireSize = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TireService.deleteTireSize(id);

  sendResponse<ITireSize>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire size deleted successfully",
    data: result,
  });
});

export const TireSizeController = {
  createTireSize,
  getSingleTireSize,
  getAllTireSizes,
  updateTireSize,
  deleteTireSize,
};
