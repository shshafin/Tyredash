import { IReview } from "./review.interface";
import { Review } from "./review.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { reviewSearchableFields } from "./review.constants";

const createReview = async (reviewData: IReview): Promise<IReview> => {
  const isExist = await Review.findOne({
    user: reviewData.user,
    product: reviewData.product,
    productType: reviewData.productType,
  });

  if (isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this product"
    );
  }

  const result = await Review.create(reviewData);
  return result;
};

const getAllReviews = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IReview[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: reviewSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Review.find(whereConditions)
    .populate("user")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleReview = async (id: string): Promise<IReview | null> => {
  const result = await Review.findById(id).populate("user");
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }
  return result;
};

const updateReview = async (
  id: string,
  payload: Partial<IReview>,
  userId: string
): Promise<IReview | null> => {
  const isExist = await Review.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }

  // Check if the user is the owner of the review
  if (isExist.user.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only update your own reviews"
    );
  }

  const result = await Review.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteReview = async (
  id: string,
  userId: string
): Promise<IReview | null> => {
  const review = await Review.findById(id);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }

  // Check if the user is the owner of the review or an admin
  if (review.user.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only delete your own reviews"
    );
  }

  const result = await Review.findByIdAndDelete(id);
  return result;
};

const getReviewsByProduct = async (
  productId: string,
  productType: string
): Promise<IReview[]> => {
  const result = await Review.find({ product: productId, productType })
    .populate("user")
    .sort({ createdAt: -1 });
  return result;
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getReviewsByProduct,
};
