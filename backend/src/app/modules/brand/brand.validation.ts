import { z } from "zod";

const createBrandZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    logo: z.string().optional(),
  }),
});

const updateBrandZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    logo: z.string().optional(),
  }),
});

export const BrandValidation = {
  createBrandZodSchema,
  updateBrandZodSchema,
};
