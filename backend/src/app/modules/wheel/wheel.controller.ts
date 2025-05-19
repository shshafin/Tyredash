import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { WheelService } from "./wheel.service";
import { IWheel } from "./wheel.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";

import { deleteFile, getFileUrl } from "../../../helpers/fileHandlers";
import ApiError from "../../../errors/ApiError";
import { Wheel } from "./wheel.model";
import { wheelFilterableFields } from "./wheel.constants";

const createWheel = catchAsync(async (req: Request, res: Response) => {
  let { data } = req.body;

  if (typeof data === "string") {
    data = JSON.parse(data);
  }

  if (req.files) {
    const images = (req.files as Express.Multer.File[]).map((file) =>
      getFileUrl(file.filename)
    );
    data.images = images;
  }

  const result = await WheelService.createWheel(data);

  sendResponse<IWheel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel created successfully",
    data: result,
  });
});

const uploadCSVTires = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new Error("No file uploaded");
  }

  const filePath = req.file.path;

  const result = await WheelService.uploadWheelCSV(filePath);

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

const getAllWheels = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, wheelFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await WheelService.getAllWheels(filters, paginationOptions);

  sendResponse<IWheel[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheels retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleWheel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WheelService.getSingleWheel(id);

  sendResponse<IWheel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel retrieved successfully",
    data: result,
  });
});

const updateWheel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let { data } = req.body;

  if (typeof data === "string") {
    data = JSON.parse(data);
  }

  const existingWheel = await Wheel.findById(id);
  if (!existingWheel) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wheel not found");
  }

  if (req.files) {
    if (existingWheel.images && existingWheel.images.length > 0) {
      await Promise.all(
        existingWheel.images.map(async (imageUrl) => {
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
    data.images = newImages;
  }

  const result = await WheelService.updateWheel(id, data);

  sendResponse<IWheel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel updated successfully",
    data: result,
  });
});

const deleteWheel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const wheel = await Wheel.findById(id);

  if (!wheel) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wheel not found");
  }

  if (wheel.images?.length) {
    const deletionResults = await Promise.allSettled(
      wheel.images.map(async (imageUrl) => {
        const filename = imageUrl.split("/").pop();
        if (filename) {
          deleteFile(filename);
        }
      })
    );

    deletionResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to delete image ${wheel.images?.[index]}:`,
          result.reason
        );
      }
    });
  }

  const result = await WheelService.deleteWheel(id);

  sendResponse<IWheel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel deleted successfully",
    data: result,
  });
});

export const WheelController = {
  createWheel,
  getAllWheels,
  getSingleWheel,
  updateWheel,
  deleteWheel,
  uploadCSVTires,
};
