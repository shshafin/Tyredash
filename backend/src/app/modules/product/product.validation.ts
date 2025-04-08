import { z } from "zod";

const createProductZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Product name is required",
    }),
    slug: z.string({
      required_error: "Product slug is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    price: z.number({
      required_error: "Price is required",
    }),
    salePrice: z.number().optional(),
    stock: z.number({
      required_error: "Stock is required",
    }),
    sku: z.string({
      required_error: "SKU is required",
    }),
    images: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    category: z.string({
      required_error: "Category is required",
    }),
    compatibleVehicles: z
      .array(
        z.object({
          year: z.string().optional(),
          make: z.string().optional(),
          model: z.string().optional(),
          trim: z.string().optional(),
        })
      )
      .optional(),
    brand: z.string().optional(),
  }),
});

const updateProductZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    salePrice: z.number().optional(),
    stock: z.number().optional(),
    sku: z.string().optional(),
    images: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    category: z.string().optional(),
    compatibleVehicles: z
      .array(
        z.object({
          year: z.string().optional(),
          make: z.string().optional(),
          model: z.string().optional(),
          trim: z.string().optional(),
        })
      )
      .optional(),
    brand: z.string().optional(),
  }),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
};
