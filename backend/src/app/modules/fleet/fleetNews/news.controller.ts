import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../shared/catchAsync";
import { FleetNewsService } from "./news.service";
import sendResponse from "../../../../shared/sendResponse";
import { IFleetNews } from "./news.interface";
import pick from "../../../../shared/pick";
import { fleetNewsFilterableFields } from "./news.constants";
import { paginationFields } from "../../../../constants/pagination";
import { FleetNews } from "./news.model";
import ApiError from "../../../../errors/ApiError";
const createFleetNews = catchAsync(async (req: Request, res: Response) => {
  let { data } = req.body;

  if (typeof data === "string") {
    data = JSON.parse(data);
  }

  const result = await FleetNewsService.createFleetNews(data);

  sendResponse<IFleetNews>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet news created successfully",
    data: result,
  });
});

const getAllFleetNews = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, fleetNewsFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await FleetNewsService.getAllFleetNews(
    filters,
    paginationOptions
  );

  sendResponse<IFleetNews[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet news retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleFleetNews = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FleetNewsService.getSingleFleetNews(id);

  sendResponse<IFleetNews>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet news retrieved successfully",
    data: result,
  });
});

const updateFleetNews = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let { updatedData } = req.body;

  if (typeof updatedData === "string") {
    updatedData = JSON.parse(updatedData);
  }

  const existingNews = await FleetNews.findById(id);
  if (!existingNews) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet news not found");
  }

  const result = await FleetNewsService.updateFleetNews(id, updatedData);

  sendResponse<IFleetNews>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet news updated successfully",
    data: result,
  });
});

const deleteFleetNews = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const news = await FleetNews.findById(id);

  if (!news) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet news not found");
  }

  const result = await FleetNewsService.deleteFleetNews(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet news deleted successfully",
    data: result,
  });
});

// Additional Controllers
const getFeaturedNews = catchAsync(async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 3;
  const result = await FleetNewsService.getFeaturedFleetNews(limit);

  sendResponse<IFleetNews[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Featured fleet news retrieved successfully",
    data: result,
  });
});

const getRecentNews = catchAsync(async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  const result = await FleetNewsService.getRecentFleetNews(limit);

  sendResponse<IFleetNews[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recent fleet news retrieved successfully",
    data: result,
  });
});

export const FleetNewsController = {
  createFleetNews,
  getAllFleetNews,
  getSingleFleetNews,
  updateFleetNews,
  deleteFleetNews,
  getFeaturedNews,
  getRecentNews,
};
