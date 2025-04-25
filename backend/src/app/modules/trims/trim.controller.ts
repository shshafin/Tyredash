import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TrimService } from "./trim.service";
import { ITrim } from "./trim.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { modelFilterableFields } from "../models/model.constants";

const createTrim = catchAsync(async (req: Request, res: Response) => {
  const { ...trimData } = req.body;
  const result = await TrimService.createTrim(trimData);

  sendResponse<ITrim>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trim created successfully",
    data: result,
  });
});

const getSingleTrim = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TrimService.getSingleTrim(id);

  sendResponse<ITrim>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trim fetched successfully",
    data: result,
  });
});

const getAllTrims = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, modelFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await TrimService.getAllTrims(paginationOptions, filters);

  sendResponse<ITrim[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trims fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateTrim = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TrimService.updateTrim(id, req.body);

  sendResponse<ITrim>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trim updated successfully",
    data: result,
  });
});

const deleteTrim = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TrimService.deleteTrim(id);

  sendResponse<ITrim>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trim deleted successfully",
    data: result,
  });
});

const uploadCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const result = await TrimService.processCSVUpload(file.path);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing the CSV file" });
  }
};

export const TrimController = {
  createTrim,
  getSingleTrim,
  getAllTrims,
  updateTrim,
  deleteTrim,
  uploadCSV,
};
