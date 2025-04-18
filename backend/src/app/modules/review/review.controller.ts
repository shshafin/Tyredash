import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";
import { IReview } from "./review.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { reviewFilterableFields } from "./review.constants";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const { ...reviewData } = req.body;
  reviewData.user = req.user?.userId; // Set the user from the authenticated user
  const result = await ReviewService.createReview(reviewData);

  sendResponse<IReview>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ReviewService.getAllReviews(filters, paginationOptions);

  sendResponse<IReview[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.getSingleReview(id);

  sendResponse<IReview>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review retrieved successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const userId = req.user?.userId;
  const result = await ReviewService.updateReview(id, updatedData, userId);

  sendResponse<IReview>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const result = await ReviewService.deleteReview(id, userId);

  sendResponse<IReview>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

const getReviewsByProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId, productType } = req.params;
  const result = await ReviewService.getReviewsByProduct(
    productId,
    productType
  );

  sendResponse<IReview[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product reviews retrieved successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getReviewsByProduct,
};
