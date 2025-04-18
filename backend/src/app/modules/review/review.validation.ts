import { z } from "zod";
import { productType } from "./review.constants";

const createReviewZodSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: "User ID is required",
    }),
    product: z.string({
      required_error: "Product ID is required",
    }),
    productType: z.enum([...productType] as [string, ...string[]], {
      required_error: "Product type is required",
    }),
    rating: z
      .number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5"),
    comment: z.string().optional(),
  }),
});

const updateReviewZodSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5")
      .optional(),
    comment: z.string().optional(),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
};
