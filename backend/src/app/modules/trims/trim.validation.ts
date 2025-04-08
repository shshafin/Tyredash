import { z } from "zod";

const createTrimZodSchema = z.object({
  body: z.object({
    trim: z.string({
      required_error: "Trim name is required",
    }),
    make: z.string({
      required_error: "Make is required",
    }),
    model: z.string({
      required_error: "Model is required",
    }),
    year: z.string({
      required_error: "Year is required",
    }),
  }),
});

const updateTrimZodSchema = z.object({
  body: z.object({
    trim: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.string().optional(),
  }),
});

export const TrimValidation = {
  createTrimZodSchema,
  updateTrimZodSchema,
};
