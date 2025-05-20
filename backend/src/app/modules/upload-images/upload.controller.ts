import { Request, Response } from "express";
import httpStatus from "http-status";
import { uploadService } from "./upload.service";
import sendResponse from "../../../shared/sendResponse";

const createMedia = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "No images uploaded!",
      });
    }

    const images = files.map((file: Express.Multer.File) => ({
      filename: file.filename,
      url: `/storage/${file.filename}`,
      userId: req.user?._id || undefined,
    }));

    const result = await uploadService.createMedia(images);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Images uploaded successfully!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error instanceof Error ? error.message : "Upload failed",
    });
  }
};

export const uploadController = { createMedia };
