import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TireService } from "./tire.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { tireFilterableFields } from "./tire.constants";
import { ITire } from "./tire.interface";
import { deleteFile, getFileUrl } from "../../../helpers/fileHandlers";
import ApiError from "../../../errors/ApiError";
import { Tire } from "./tire.model";
import { Types } from "mongoose";

const createTire = catchAsync(async (req: Request, res: Response) => {
  let { data } = req.body;

  if (typeof data === "string") {
    data = JSON.parse(data);
  }

  const objectIdFields = [
    "year",
    "make",
    "model",
    "trim",
    "tireSize",
    "drivingType",
    "brand",
    "category",
    "width",
    "ratio",
    "diameter",
    "vehicleType",
  ];

  for (const field of objectIdFields) {
    if (data[field] && !Types.ObjectId.isValid(data[field])) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Invalid ${field} ID`);
    }
  }

  if (req.files) {
    const images = (req.files as Express.Multer.File[]).map((file) =>
      getFileUrl(file.filename)
    );
    data.images = images;
  }

  const result = await TireService.createTire(data);

  sendResponse<ITire>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tire created successfully",
    data: result,
  });
});

const uploadCSVTires = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new Error("No file uploaded");
  }

  const filePath = req.file.path;

  const result = await TireService.uploadCSVTires(filePath);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message || "CSV processed successfully",
    data: {
      processedCount: result.processedCount,
      // You can add more metadata here if needed
    },
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

  let { updatedData } = req.body;

  if (typeof updatedData === "string") {
    updatedData = JSON.parse(updatedData);
  }

  const existingTire = await Tire.findById(id);
  if (!existingTire) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tire not found");
  }

  if (req.files) {
    if (existingTire.images && existingTire.images.length > 0) {
      await Promise.all(
        existingTire.images.map(async (imageUrl) => {
          const filename = imageUrl.split("/").pop();
          if (filename) {
            deleteFile(filename);
          }
        })
      );
    }
    const newImages = (req.files as Express.Multer.File[]).map((file) =>
      getFileUrl(file.filename)
    );
    updatedData.images = newImages;
  }

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
  const tire = await Tire.findById(id);

  if (!tire) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tire not found");
  }

  if (tire.images?.length) {
    const deletionResults = await Promise.allSettled(
      tire.images.map(async (imageUrl) => {
        const filename = imageUrl.split("/").pop();
        if (filename) {
          deleteFile(filename);
        }
      })
    );

    deletionResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to delete image ${tire.images?.[index]}:`,
          result.reason
        );
      }
    });
  }

  const result = await TireService.deleteTire(id);
  sendResponse(res, {
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
  uploadCSVTires,
};
