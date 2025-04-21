import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TireService } from "./tire.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { tireFilterableFields } from "./tire.constants";
import { ITire } from "./tire.interface";

const createTire = catchAsync(async (req: Request, res: Response) => {
  const { ...tireData } = req.body;
  const result = await TireService.createTire(tireData);

  sendResponse<ITire>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire created successfully",
    data: result,
  });
});

const getAllTires = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, tireFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await TireService.getAllTires(filters, paginationOptions);

  sendResponse<ITire[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tires retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleTire = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TireService.getSingleTire(id);

  sendResponse<ITire>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire retrieved successfully",
    data: result,
  });
});

const updateTire = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await TireService.updateTire(id, updatedData);

  sendResponse<ITire>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire updated successfully",
    data: result,
  });
});

const deleteTire = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TireService.deleteTire(id);

  sendResponse<ITire>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire deleted successfully",
    data: result,
  });
});

export const TireController = {
  createTire,
  getAllTires,
  getSingleTire,
  updateTire,
  deleteTire,
};
