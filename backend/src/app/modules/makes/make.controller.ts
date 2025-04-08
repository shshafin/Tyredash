import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MakeService } from "./make.service";
import { IMake } from "./make.interface";
import { paginationFields } from "../../../constants/pagination";
import pick from "../../../shared/pick";

const createMake = catchAsync(async (req: Request, res: Response) => {
  const { ...makeData } = req.body;
  const result = await MakeService.createMake(makeData);

  sendResponse<IMake>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Make created successfully",
    data: result,
  });
});

const getSingleMake = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MakeService.getSingleMake(id);

  sendResponse<IMake>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Make fetched successfully",
    data: result,
  });
});

const getAllMakes = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result = await MakeService.getAllMakes(paginationOptions);

  sendResponse<IMake[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Makes fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateMake = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MakeService.updateMake(id, req.body);

  sendResponse<IMake>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Make updated successfully",
    data: result,
  });
});

const deleteMake = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MakeService.deleteMake(id);

  sendResponse<IMake>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Make deleted successfully",
    data: result,
  });
});

export const MakeController = {
  createMake,
  getSingleMake,
  getAllMakes,
  updateMake,
  deleteMake,
};
