import { z } from "zod";
import { DealApplicableCollections } from "./deal.interface";

const createDealZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    description: z.string().optional(),
    discountType: z.enum(["percentage", "fixed"], {
      required_error: "Discount type is required",
    }),
    discountValue: z.number({ required_error: "Discount value is required" }),
    brand: z.string({ required_error: "Brand ID is required" }),
    applyTo: z
      .object({
        tires: z.boolean().default(false),
        wheels: z.boolean().default(false),
        products: z.boolean().default(false),
      })
      .refine((data) => data.tires || data.wheels || data.products, {
        message: "Must apply to at least one product type",
      }),
    minOrderAmount: z.number().min(0).optional(),
    maxDiscount: z.number().min(0).optional(),
    startDate: z.string({ required_error: "Start date is required" }),
    endDate: z.string({ required_error: "End date is required" }),
    isActive: z.boolean().default(true),
  }),
});

const updateDealZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    discountType: z.enum(["percentage", "fixed"]).optional(),
    discountValue: z.number().optional(),
    applyTo: z
      .object({
        tires: z.boolean().optional(),
        wheels: z.boolean().optional(),
        products: z.boolean().optional(),
      })
      .optional(),
    minOrderAmount: z.number().min(0).optional(),
    maxDiscount: z.number().min(0).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const DealValidation = {
  createDealZodSchema,
  updateDealZodSchema,
};
