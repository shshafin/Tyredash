import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BrandService } from "./brand.service";
import { IBrand } from "./brand.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { brandFilterableFields } from "./brand.constants";

const createBrand = catchAsync(async (req: Request, res: Response) => {
  const { ...brandData } = req.body;
  const result = await BrandService.createBrand(brandData);

  sendResponse<IBrand>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand created successfully",
    data: result,
  });
});

const getAllBrands = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, brandFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BrandService.getAllBrands(filters, paginationOptions);

  sendResponse<IBrand[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brands retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BrandService.getSingleBrand(id);

  sendResponse<IBrand>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand retrieved successfully",
    data: result,
  });
});

const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await BrandService.updateBrand(id, updatedData);

  sendResponse<IBrand>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand updated successfully",
    data: result,
  });
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BrandService.deleteBrand(id);

  sendResponse<IBrand>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand deleted successfully",
    data: result,
  });
});

export const BrandController = {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
};
