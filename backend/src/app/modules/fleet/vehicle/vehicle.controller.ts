import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../shared/catchAsync";
import { FleetVehicleService } from "./vehicle.service";
import { IFLeetVehicle } from "./vehicle.interface";
import sendResponse from "../../../../shared/sendResponse";
import pick from "../../../../shared/pick";
import { fleetVehicleFilterableFields } from "./vehicle.constants";
import { paginationFields } from "../../../../constants/pagination";

const createFleetVehicle = catchAsync(async (req: Request, res: Response) => {
  const { ...fleetVehicleData } = req.body;

  const result = await FleetVehicleService.createFleetVehicle(fleetVehicleData);

  sendResponse<IFLeetVehicle>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet vehicle created successfully",
    data: result,
  });
});

const getSingleFleetVehicle = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await FleetVehicleService.getSingleFleetVehicle(id);

    sendResponse<IFLeetVehicle>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Fleet vehicle fetched successfully",
      data: result,
    });
  }
);

const getAllFleetVehicles = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, fleetVehicleFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await FleetVehicleService.getAllFleetVehicles(
    filters,
    paginationOptions
  );

  sendResponse<IFLeetVehicle[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet vehicles fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateFleetVehicle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;

  const result = await FleetVehicleService.updateFleetVehicle(id, updatedData);

  sendResponse<IFLeetVehicle>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet vehicle updated successfully",
    data: result,
  });
});

const deleteFleetVehicle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await FleetVehicleService.deleteFleetVehicle(id);

  sendResponse<IFLeetVehicle>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet vehicle deleted successfully",
    data: result,
  });
});

export const FleetVehicleController = {
  createFleetVehicle,
  getSingleFleetVehicle,
  getAllFleetVehicles,
  updateFleetVehicle,
  deleteFleetVehicle,
};
