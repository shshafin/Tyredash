// fleetSupport.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../shared/catchAsync";
import { deleteFile, getFileUrl } from "../../../../helpers/fileHandlers";
import { FleetSupportService } from "./support.service";
import { IFleetSupport } from "./support.interface";
import sendResponse from "../../../../shared/sendResponse";
import pick from "../../../../shared/pick";
import { fleetSupportFilterableFields } from "./support.constants";
import { paginationFields } from "../../../../constants/pagination";
import { FleetSupport } from "./support.model";
import ApiError from "../../../../errors/ApiError";

const createFleetSupport = catchAsync(async (req: Request, res: Response) => {
  let { data } = req.body;

  if (typeof data === "string") {
    data = JSON.parse(data);
  }

  if (req.files) {
    const files = (req.files as Express.Multer.File[]).map((file) =>
      getFileUrl(file.filename)
    );
    data.files = files;
  }

  const result = await FleetSupportService.createFleetSupport(data);

  sendResponse<IFleetSupport>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet support request created successfully",
    data: result,
  });
});

const getAllFleetSupports = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, fleetSupportFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await FleetSupportService.getAllFleetSupports(
    filters,
    paginationOptions
  );

  sendResponse<IFleetSupport[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet support requests retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleFleetSupport = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await FleetSupportService.getSingleFleetSupport(id);

    sendResponse<IFleetSupport>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Fleet support request retrieved successfully",
      data: result,
    });
  }
);

const updateFleetSupport = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  let { updatedData } = req.body;

  if (typeof updatedData === "string") {
    updatedData = JSON.parse(updatedData);
  }

  const existingSupport = await FleetSupport.findById(id);
  if (!existingSupport) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet support request not found");
  }

  if (req.files) {
    if (existingSupport.files && existingSupport.files.length > 0) {
      await Promise.all(
        existingSupport.files.map(async (fileUrl) => {
          const filename = fileUrl.split("/").pop();
          if (filename) {
            deleteFile(filename);
          }
        })
      );
    }
    const newFiles = (req.files as Express.Multer.File[]).map((file) =>
      getFileUrl(file.filename)
    );
    updatedData.files = newFiles;
  }

  const result = await FleetSupportService.updateFleetSupport(id, updatedData);

  sendResponse<IFleetSupport>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet support request updated successfully",
    data: result,
  });
});

const deleteFleetSupport = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const support = await FleetSupport.findById(id);

  if (!support) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet support request not found");
  }

  if (support.files?.length) {
    const deletionResults = await Promise.allSettled(
      support.files.map(async (fileUrl) => {
        const filename = fileUrl.split("/").pop();
        if (filename) {
          deleteFile(filename);
        }
      })
    );

    deletionResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to delete file ${support.files?.[index]}:`,
          result.reason
        );
      }
    });
  }

  const result = await FleetSupportService.deleteFleetSupport(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet support request deleted successfully",
    data: result,
  });
});

export const FleetSupportController = {
  createFleetSupport,
  getAllFleetSupports,
  getSingleFleetSupport,
  updateFleetSupport,
  deleteFleetSupport,
};
