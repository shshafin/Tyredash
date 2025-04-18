import { z } from "zod";

const paymentMethodEnum = z.enum([
  "credit_card",
  "paypal",
  "stripe",
  "bank_transfer",
  "cash_on_delivery",
]);

const paymentStatusEnum = z.enum([
  "pending",
  "completed",
  "failed",
  "refunded",
  "partially_refunded",
]);

const createPaymentZodSchema = z.object({
  body: z.object({
    order: z.string({
      required_error: "Order ID is required",
    }),
    paymentMethod: paymentMethodEnum,
    amount: z
      .number({
        required_error: "Amount is required",
      })
      .positive("Amount must be positive"),
    paymentDetails: z.record(z.any()).optional(),
  }),
});

const updatePaymentStatusZodSchema = z.object({
  body: z.object({
    status: paymentStatusEnum,
    transactionId: z.string().optional(),
  }),
});

const processPaymentZodSchema = z.object({
  body: z.object({
    paymentMethod: paymentMethodEnum,
    paymentDetails: z.record(z.any()),
  }),
});

export const PaymentValidation = {
  createPaymentZodSchema,
  updatePaymentStatusZodSchema,
  processPaymentZodSchema,
};
