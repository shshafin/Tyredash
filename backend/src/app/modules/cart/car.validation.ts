import { z } from "zod";

const cartItemSchema = z.object({
  product: z.string({
    required_error: "Product ID is required",
  }),
  productType: z.enum(["tire", "wheel"], {
    required_error:
      "Product type is required and must be either 'tire' or 'wheel'",
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
});

const createCartZodSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: "User ID is required",
    }),
    items: z.array(cartItemSchema).nonempty({
      message: "Cart must contain at least one item",
    }),
  }),
});

const addItemToCartZodSchema = z.object({
  body: cartItemSchema,
});

const updateCartItemZodSchema = z.object({
  body: z.object({
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
