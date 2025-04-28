import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { WheelService } from "./wheel.service";
import { IWheel } from "./wheel.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { wheelFilterableFields } from "./whell.constants";
import { deleteFile, getFileUrl } from "../../../helpers/fileHandlers";
import ApiError from "../../../errors/ApiError";
import { Wheel } from "./wheel.model";

const createWheel = catchAsync(async (req: Request, res: Response) => {
  const { ...wheelData } = req.body;

  if (req.files) {
    const images = (req.files as Express.Multer.File[]).map((file) =>
      getFileUrl(file.filename)
    );
    wheelData.images = images;
  }

  const result = await WheelService.createWheel(wheelData);

  sendResponse<IWheel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wheel created successfully",
    data: result,
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
  const { ...updatedData } = req.body;

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
    updatedData.images = newImages;
  }

  const result = await WheelService.updateWheel(id, updatedData);

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
          await deleteFile(filename);
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
};
