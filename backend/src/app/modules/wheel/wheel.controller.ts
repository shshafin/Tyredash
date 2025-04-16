import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { WheelService } from "./wheel.service";
import { IWheel } from "./wheel.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { wheelFilterableFields } from "./whell.constants";

const createWheel = catchAsync(async (req: Request, res: Response) => {
  const { ...wheelData } = req.body;
  const result = await WheelService.createWheel(wheelData);

  sendResponse<IWheel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel created successfully",
    data: result,
  });
});

const getAllWheels = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, wheelFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await WheelService.getAllWheels(filters, paginationOptions);

  sendResponse<IWheel[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheels retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleWheel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WheelService.getSingleWheel(id);

  sendResponse<IWheel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel retrieved successfully",
    data: result,
  });
});

const updateWheel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await WheelService.updateWheel(id, updatedData);

  sendResponse<IWheel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel updated successfully",
    data: result,
  });
});

const deleteWheel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WheelService.deleteWheel(id);

  sendResponse<IWheel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel deleted successfully",
    data: result,
  });
});

export const WheelController = {
  createWheel,
  getAllWheels,
  getSingleWheel,
  updateWheel,
  deleteWheel,
};
