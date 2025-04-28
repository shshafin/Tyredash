import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BrandService } from "./brand.service";
import { IBrand } from "./brand.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { brandFilterableFields } from "./brand.constants";
import { Brand } from "./brand.model";
import { deleteFile, getFileUrl } from "../../../helpers/fileHandlers";
import ApiError from "../../../errors/ApiError";

const createBrand = catchAsync(async (req: Request, res: Response) => {
  const { ...brandData } = req.body;

  const existingBrand = await Brand.findOne({ name: brandData.name });
  if (existingBrand) {
    if (req.file) {
      deleteFile(req.file.filename);
    }
    throw new ApiError(httpStatus.BAD_REQUEST, "Brand already exists");
  }

  if (req.file) {
    brandData.logo = getFileUrl(req.file.filename);
  }

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
  const { ...updateData } = req.body;

  const existingBrand = await Brand.findById(id);
  if (!existingBrand) {
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
  }

  if (req.file) {
    if (existingBrand.logo) {
      const oldFilename = existingBrand.logo.split("/").pop();
      deleteFile(oldFilename ?? "");
    }
    updateData.logo = getFileUrl(req.file.filename);
  }

  const result = await BrandService.updateBrand(id, updateData);

  sendResponse<IBrand>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand updated successfully",
    data: result,
  });
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const brand = await BrandService.getSingleBrand(id);
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
  }

  if (brand.logo) {
    const filename = brand.logo.split("/").pop();
    deleteFile(filename ?? "");
  }

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
