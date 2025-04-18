import { z } from "zod";

const orderItemSchema = z.object({
  product: z.string({
    required_error: "Product ID is required",
  }),
  productType: z.enum(["tire", "wheel"], {
    required_error: "Product type must be either 'tire' or 'wheel'",
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
    .positive("Price must be positive"),
});

const shippingAddressSchema = z.object({
  street: z.string({
    required_error: "Street is required",
  }),
  city: z.string({
    required_error: "City is required",
  }),
  state: z.string({
    required_error: "State is required",
  }),
  postalCode: z.string({
    required_error: "Postal code is required",
  }),
  country: z.string().default("USA"),
  phone: z.string({
    required_error: "Phone number is required",
  }),
});

const paymentResultSchema = z.object({
  id: z.string().optional(),
  status: z.string().optional(),
  update_time: z.string().optional(),
  email_address: z.string().optional(),
});

const createOrderZodSchema = z.object({
  body: z.object({
    items: z.array(orderItemSchema).nonempty({
      message: "Order must contain at least one item",
    }),
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.enum(["paypal", "credit_card"], {
      required_error: "Payment method is required",
    }),
    taxPrice: z
      .number({
        required_error: "Tax price is required",
      })
      .nonnegative("Tax price must be positive or zero"),
    shippingPrice: z
      .number({
        required_error: "Shipping price is required",
      })
      .nonnegative("Shipping price must be positive or zero"),
  }),
});

const updateOrderStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(
      ["pending", "processing", "shipped", "delivered", "cancelled"] as const,
      {
        required_error: "Status is required",
      }
    ),
  }),
});

const updatePaymentResultZodSchema = z.object({
  body: paymentResultSchema,
});

export const OrderValidation = {
  createOrderZodSchema,
  updateOrderStatusZodSchema,
  updatePaymentResultZodSchema,
};
