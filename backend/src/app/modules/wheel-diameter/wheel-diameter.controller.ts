import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { WheelDiameterService } from "./wheel-diameter.service";

const createWheelDiameter = catchAsync(async (req: Request, res: Response) => {
  const { ...diameterData } = req.body;
  const result = await WheelDiameterService.createWheelDiameter(diameterData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel Diameter created successfully",
    data: result,
  });
});

const getSingleWheelDiameter = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await WheelDiameterService.getSingleWheelDiameter(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wheel Diameter fetched successfully",
      data: result,
    });
  }
);

const getAllWheelDiameter = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result =
    await WheelDiameterService.getAllWheelDiameter(paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Wheel Diameter fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateWheelDiameter = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WheelDiameterService.updateWheelDiameter(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel Diameter updated successfully",
    data: result,
  });
});

const deleteWheelDiameter = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WheelDiameterService.deleteWheelDiameter(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel diameter deleted successfully",
    data: result,
  });
});

export const WheelDiameterController = {
  createWheelDiameter,
  getSingleWheelDiameter,
  getAllWheelDiameter,
  updateWheelDiameter,
  deleteWheelDiameter,
};
