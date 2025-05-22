import { Review } from "./review.model";
import {
  IReview,
  IPopulatedReview,
  IUserPreview,
  IReviewStats,
  IProductWithReviews,
} from "./review.interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import mongoose, { SortOrder, Types } from "mongoose";
import { reviewSearchableFields } from "./review.constants";

const getUserPreviewFields = "firstName lastName email avatar";

const createReview = async (payload: IReview): Promise<IReview> => {
  // Check for existing review
  const existingReview = await Review.findOne({
    user: payload.user,
    product: payload.product,
    productType: payload.productType,
  });

  if (existingReview) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this product"
    );
  }

  return Review.create(payload);
};

const getAllReviews = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPopulatedReview[]>> => {
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

  const [result, total] = await Promise.all([
    Review.find(whereConditions)
      .populate<{ user: IUserPreview }>({
        path: "user",
        select: getUserPreviewFields,
      })
      .sort(sortConditions)
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(whereConditions),
  ]);

  return {
    meta: { page, limit, total },
    data: result as IPopulatedReview[],
  };
};

const getSingleReview = async (id: string): Promise<IPopulatedReview> => {
  const result = await Review.findById(id)
    .populate<{ user: IUserPreview }>({
      path: "user",
      select: getUserPreviewFields,
    })
    .orFail(() => new ApiError(httpStatus.NOT_FOUND, "Review not found"))
    .lean();

  return result as IPopulatedReview;
};

const updateReview = async (
  id: string,
  payload: Partial<IReview>,
  userId: string
): Promise<IPopulatedReview> => {
  const review = await Review.findById(id).orFail(
    () => new ApiError(httpStatus.NOT_FOUND, "Review not found")
  );

  if (review.user.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only update your own reviews"
    );
  }

  const updatedReview = await Review.findByIdAndUpdate(id, payload, {
    new: true,
  })
    .populate<{ user: IUserPreview }>({
      path: "user",
      select: getUserPreviewFields,
    })
    .lean();

  return updatedReview as IPopulatedReview;
};

const deleteReview = async (
  id: string,
  userId: string
): Promise<IPopulatedReview> => {
  const review = await Review.findById(id).orFail(
    () => new ApiError(httpStatus.NOT_FOUND, "Review not found")
  );

  if (review.user.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only delete your own reviews"
    );
  }

  const deletedReview = await Review.findByIdAndDelete(id)
    .populate<{ user: IUserPreview }>({
      path: "user",
      select: getUserPreviewFields,
    })
    .lean();

  return deletedReview as IPopulatedReview;
};

const getReviewsByProduct = async (
  productId: string,
  productType: "tire" | "wheel" | "product"
): Promise<IPopulatedReview[]> => {
  return Review.find({ product: productId, productType })
    .populate<{ user: IUserPreview }>({
      path: "user",
      select: getUserPreviewFields,
    })
    .sort({ createdAt: -1 })
    .lean() as Promise<IPopulatedReview[]>;
};

const getReviewStats = async (
  productId: string,
  productType: "tire" | "wheel" | "product"
): Promise<IReviewStats> => {
  const [stats] = await Review.aggregate<IReviewStats>([
    {
      $match: {
        product: new Types.ObjectId(productId),
        productType,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
    {
      $project: {
        _id: 0,
        averageRating: { $round: ["$averageRating", 1] },
        reviewCount: 1,
        ratingDistribution: {
          1: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                as: "rating",
                cond: { $eq: ["$$rating", 1] },
              },
            },
          },
          2: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                as: "rating",
                cond: { $eq: ["$$rating", 2] },
              },
            },
          },
          3: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                as: "rating",
                cond: { $eq: ["$$rating", 3] },
              },
            },
          },
          4: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                as: "rating",
                cond: { $eq: ["$$rating", 4] },
              },
            },
          },
          5: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                as: "rating",
                cond: { $eq: ["$$rating", 5] },
              },
            },
          },
        },
      },
    },
  ]);

  return (
    stats || {
      averageRating: 0,
      reviewCount: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }
  );
};

const getProductWithReviews = async <T>(
  productId: string,
  productType: "tire" | "wheel" | "product"
): Promise<IProductWithReviews<T>> => {
  const modelName = productType.charAt(0).toUpperCase() + productType.slice(1);
  const productModel = mongoose.model<T>(modelName);

  const [productDoc, reviews, stats] = await Promise.all([
    productModel.findById(productId).lean(),
    getReviewsByProduct(productId, productType),
    getReviewStats(productId, productType),
  ]);

  if (!productDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  return {
    product: productDoc as T,
    reviews,
    stats,
  };
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getReviewsByProduct,
  getReviewStats,
  getProductWithReviews,
};
