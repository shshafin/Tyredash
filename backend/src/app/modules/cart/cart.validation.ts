import { z } from "zod";

const cartItemSchema = z.object({
  product: z.string({
    required_error: "Product ID is required",
  }),
  productType: z.enum(["tire", "wheel", "product"], {
    required_error:
      "Product type is required and must be 'tire', 'wheel', or 'product'",
  }),
  quantity: z
    .number({
      required_error: "Quantity is required",
    })
    .min(1, "Quantity must be at least 1"),
  price: z
    .number({
      required_error: "Price is required",
    })
    .positive("Price must be a positive number"),
  name: z.string({
    required_error: "Product name is required",
  }),
  thumbnail: z.string().optional(),
});

const createCartZodSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: "User ID is required",
    }),
    items: z.array(cartItemSchema).optional().default([]),
    totalPrice: z.number().optional().default(0),
    totalItems: z.number().optional().default(0),
  }),
});

const addItemToCartZodSchema = z.object({
  body: z.object({
    product: z.string({
      required_error: "Product ID is required",
    }),
    productType: z.enum(["tire", "wheel", "product"], {
      required_error:
        "Product type is required and must be 'tire', 'wheel', or 'product'",
    }),
    quantity: z
      .number({
        required_error: "Quantity is required",
      })
      .min(1, "Quantity must be at least 1"),
  }),
});

const updateCartItemZodSchema = z.object({
  body: z.object({
    productType: z.enum(["tire", "wheel", "product"], {
      required_error: "Product type is required for update",
    }),
    quantity: z
      .number({
        required_error: "Quantity is required",
      })
      .min(1, "Quantity must be at least 1"),
  }),
});

export const CartValidation = {
  createCartZodSchema,
  addItemToCartZodSchema,
  updateCartItemZodSchema,
};
