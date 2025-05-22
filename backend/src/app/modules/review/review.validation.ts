import { z } from "zod";
// import { productTypes } from "../product/product.constant";

const createReviewZodSchema = z.object({
  body: z.object({
    product: z.string(),
    productType: z.enum(["tire", "wheel", "product"] as [string, ...string[]]),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  }),
});

const updateReviewZodSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
};
