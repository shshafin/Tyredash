import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MakeService } from "./make.service";
import { IMake } from "./make.interface";
import { paginationFields } from "../../../constants/pagination";
import pick from "../../../shared/pick";
import { deleteFile, getFileUrl } from "../../../helpers/fileHandlers";
import ApiError from "../../../errors/ApiError";
import { Make } from "./make.model";

const createMake = catchAsync(async (req: Request, res: Response) => {
  const { ...makeData } = req.body;

  const existingMake = await Make.findOne({ make: makeData.make });
  if (existingMake) {
    if (req.file) {
      deleteFile(req.file.filename);
    }
    throw new ApiError(httpStatus.BAD_REQUEST, "Make already exists");
  }

  if (req.file) {
    makeData.logo = getFileUrl(req.file.filename);
  }

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
  const { ...updateData } = req.body;

  const existingMake = await Make.findById(id);
  if (!existingMake) {
    throw new ApiError(httpStatus.NOT_FOUND, "Make not found");
  }

  if (req.file) {
    if (existingMake.logo) {
      const oldFilename = existingMake.logo.split("/").pop();
      deleteFile(oldFilename ?? "");
    }
    updateData.logo = getFileUrl(req.file.filename);
  }

  const result = await MakeService.updateMake(id, updateData);

  sendResponse<IMake>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Make updated successfully",
    data: result,
  });
});

const deleteMake = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const make = await MakeService.getSingleMake(id);
  if (!make) {
    throw new ApiError(httpStatus.NOT_FOUND, "Make not found");
  }

  if (make.logo) {
    const filename = make.logo.split("/").pop();
    deleteFile(filename ?? "");
  }

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
