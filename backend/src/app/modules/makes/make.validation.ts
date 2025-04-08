import { z } from "zod";

const createMakeZodSchema = z.object({
  body: z.object({
    make: z.string({
      required_error: "Make name is required",
    }),
    year: z.string({
      required_error: "Year is required",
    }),
    logo: z.string().optional(),
  }),
});

const updateMakeZodSchema = z.object({
  body: z.object({
    make: z.string().optional(),
    year: z.string().optional(),
    logo: z.string().optional(),
  }),
});

export const MakeValidation = {
  createMakeZodSchema,
  updateMakeZodSchema,
};
