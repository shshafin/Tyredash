import { z } from "zod";

const createOrderZodSchema = z.object({
  body: z.object({
    paymentId: z.string({
      required_error: "Payment ID is required",
    }),
  }),
});

const updateOrderStatusZodSchema = z.object({
  body: z.object({
    status: z.enum([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ] as [string, ...string[]]),
    trackingNumber: z.string().optional(),
    estimatedDelivery: z.string().optional(),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
  updateOrderStatusZodSchema,
};
