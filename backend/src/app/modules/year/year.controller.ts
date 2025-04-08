import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { YearService } from "./year.service";

const createYear = catchAsync(async (req: Request, res: Response) => {
  const { ...yearData } = req.body;
  const result = await YearService.createYear(yearData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Year created successfully",
    data: result,
  });
});

const getSingleYear = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await YearService.getSingleYear(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Year fetched successfully",
    data: result,
  });
});

const getAllYears = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result = await YearService.getAllYears(paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Years fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateYear = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await YearService.updateYear(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Year updated successfully",
    data: result,
  });
});

const deleteYear = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await YearService.deleteYear(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Year deleted successfully",
    data: result,
  });
});

export const YearController = {
  createYear,
  getSingleYear,
  getAllYears,
  updateYear,
  deleteYear,
};
