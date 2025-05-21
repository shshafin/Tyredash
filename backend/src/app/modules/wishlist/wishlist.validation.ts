import { z } from "zod";

const wishlistItemSchema = z.object({
  product: z.string({
    required_error: "Product ID is required",
  }),
  productType: z.enum(["tire", "wheel", "product"], {
    required_error: "Product type must be either 'tire', 'wheel', or 'product'",
  }),
});

const createWishlistZodSchema = z.object({
  body: z.object({
    items: z.array(wishlistItemSchema).optional(),
  }),
});

const addItemToWishlistZodSchema = z.object({
  body: wishlistItemSchema,
});

export const WishlistValidation = {
  createWishlistZodSchema,
  addItemToWishlistZodSchema,
};
