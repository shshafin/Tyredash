import { z } from "zod";

const createTireSizeZodSchema = z.object({
  body: z.object({
    tireSize: z.string({
      required_error: "Tire Size name is required",
    }),
    make: z.string({
      required_error: "Make is required",
    }),
    model: z.string({
      required_error: "Model is required",
    }),
    trim: z.string({
      required_error: "trim is required",
    }),
    year: z.string({
      required_error: "Year is required",
    }),
  }),
});

const updateTireSizeZodSchema = z.object({
  body: z.object({
    tireSize: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    trim: z.string().optional(),
    year: z.string().optional(),
  }),
});

export const TireSizeValidation = {
  createTireSizeZodSchema,
  updateTireSizeZodSchema,
};
