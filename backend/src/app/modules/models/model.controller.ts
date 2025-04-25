import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ModelService } from "./model.service";
import { IModel } from "./model.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { modelFilterableFields } from "./model.constants";

const createModel = catchAsync(async (req: Request, res: Response) => {
  const { ...modelData } = req.body;
  const result = await ModelService.createModel(modelData);

  sendResponse<IModel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car model created successfully",
    data: result,
  });
});

const getSingleModel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ModelService.getSingleModel(id);

  sendResponse<IModel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car model fetched successfully",
    data: result,
  });
});

const getAllModels = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, modelFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ModelService.getAllModels(paginationOptions, filters);

  sendResponse<IModel[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car models fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateModel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ModelService.updateModel(id, req.body);

  sendResponse<IModel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car model updated successfully",
    data: result,
  });
});

const deleteModel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ModelService.deleteModel(id);

  sendResponse<IModel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car model deleted successfully",
    data: result,
  });
});

export const ModelController = {
  createModel,
  getSingleModel,
  getAllModels,
  updateModel,
  deleteModel,
};
