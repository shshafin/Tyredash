import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { TireDiameterService } from "./tire-diameter.service";

const createTireDiameter = catchAsync(async (req: Request, res: Response) => {
  const { ...diameterData } = req.body;
  const result = await TireDiameterService.createTireDiameter(diameterData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire Diameter created successfully",
    data: result,
  });
});

const getSingleTireDiameter = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TireDiameterService.getSingleTireDiameter(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tire Diameter fetched successfully",
      data: result,
    });
  }
);

const getAllTireDiameter = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result =
    await TireDiameterService.getAllTireDiameter(paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Tire Diameter fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateTireDiameter = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TireDiameterService.updateTireDiameter(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire Diameter updated successfully",
    data: result,
  });
});

const deleteTireDiameter = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TireDiameterService.deleteTireDiameter(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire diameter deleted successfully",
    data: result,
  });
});

export const TireDiameterController = {
  createTireDiameter,
  getSingleTireDiameter,
  getAllTireDiameter,
  updateTireDiameter,
  deleteTireDiameter,
};
