import { z } from "zod";

const createMakeZodSchema = z.object({
  body: z.object({
    make: z.string({
      required_error: "Make name is required",
    }),
  }),
});

const updateMakeZodSchema = z.object({
  body: z.object({
    make: z.string().optional(),
    logo: z.string().optional(),
  }),
});

export const MakeValidation = {
  createMakeZodSchema,
  updateMakeZodSchema,
};
