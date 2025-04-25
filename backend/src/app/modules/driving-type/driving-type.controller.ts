import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { paginationFields } from "../../../constants/pagination";
import pick from "../../../shared/pick";
import { DrivingTypeService } from "./driving-type.service";
import { IDrivingType } from "./driving-type.interface";
import { drivingTypeFilterableFields } from "./driving-type.constants";

const createDrivingType = catchAsync(async (req: Request, res: Response) => {
  const { ...makeData } = req.body;
  const result = await DrivingTypeService.createDrivingType(makeData);

  sendResponse<IDrivingType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Driving type created successfully",
    data: result,
  });
});

const getSingleDrivingType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DrivingTypeService.getSingleDrivingType(id);

  sendResponse<IDrivingType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Driving type fetched successfully",
    data: result,
  });
});

const getAllDrivingTypes = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, drivingTypeFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await DrivingTypeService.getAllDrivingTypes(
    paginationOptions,
    filters
  );

  sendResponse<IDrivingType[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Driving Types fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateDrivingType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DrivingTypeService.updateDrivingType(id, req.body);

  sendResponse<IDrivingType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Make updated successfully",
    data: result,
  });
});

const deleteDrivingType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DrivingTypeService.deleteDrivingType(id);

  sendResponse<IDrivingType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Driving type deleted successfully",
    data: result,
  });
});

export const DrivingTypeController = {
  createDrivingType,
  getSingleDrivingType,
  getAllDrivingTypes,
  updateDrivingType,
  deleteDrivingType,
};
