import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { WheelWidthTypeService } from "./wheel-width-type.service";

const createWheelWidthType = catchAsync(async (req: Request, res: Response) => {
  const { ...widhtData } = req.body;
  const result = await WheelWidthTypeService.createWheelWidthType(widhtData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel width type created successfully",
    data: result,
  });
});

const getSingleWheelWidthType = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await WheelWidthTypeService.getSingleWheelWidthType(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wheel width  Type fetched successfully",
      data: result,
    });
  }
);

const getAllWheelWidthType = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result =
    await WheelWidthTypeService.getAllWheelWidthType(paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Wheel width type fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateWheelWidthType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WheelWidthTypeService.updateWheelWidthType(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel Width type updated successfully",
    data: result,
  });
});

const deleteWheelWidthType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WheelWidthTypeService.deleteWheelWidthType(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "wheel width type deleted successfully",
    data: result,
  });
});

export const WheelWidthTypeController = {
  createWheelWidthType,
  getSingleWheelWidthType,
  getAllWheelWidthType,
  updateWheelWidthType,
  deleteWheelWidthType,
};
