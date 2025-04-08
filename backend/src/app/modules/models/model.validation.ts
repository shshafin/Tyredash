import { z } from "zod";

const createModelZodSchema = z.object({
  body: z.object({
    model: z.string({
      required_error: "Car model is required",
    }),
    make: z.string({
      required_error: "Make is required",
    }),
    year: z.string({
      required_error: "Year is required",
    }),
  }),
});

const updateModelZodSchema = z.object({
  body: z.object({
    model: z.string().optional(),
    make: z.string().optional(),
    year: z.string().optional(),
  }),
});

export const ModelValidation = {
  createModelZodSchema,
  updateModelZodSchema,
};
