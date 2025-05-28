import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { VehicleTypeService } from "./vehicle-type.service";

const createVehicleType = catchAsync(async (req: Request, res: Response) => {
  const { ...vehicleType } = req.body;
  const result = await VehicleTypeService.createVehicleType(vehicleType);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vehicle Type created successfully",
    data: result,
  });
});

const getSingleVehicleType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VehicleTypeService.getSingleVehicleType(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vehicle Type fetched successfully",
    data: result,
  });
});

const getAllVehicleType = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result = await VehicleTypeService.getAllVehicleType(paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Vehicle Type fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateVehicleType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VehicleTypeService.updateVehicleType(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire Diameter updated successfully",
    data: result,
  });
});

const deleteVehicleType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VehicleTypeService.deleteVehicleType(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vehicle Type deleted successfully",
    data: result,
  });
});

export const VehicleTypeController = {
  createVehicleType,
  getSingleVehicleType,
  getAllVehicleType,
  updateVehicleType,
  deleteVehicleType,
};
