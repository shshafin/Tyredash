import { z } from "zod";

const createYearZodSchema = z.object({
  body: z.object({
    year: z
      .number({
        required_error: "Year is required",
        invalid_type_error: "Year must be a number",
      })
      .min(1900, "Year must be greater than or equal to 1900")
      .max(
        new Date().getFullYear() + 1,
        "Year must be less than or equal to the current year"
      ),
  }),
});

const updateYearZodSchema = z.object({
  body: z.object({
    year: z
      .number()
      .min(1900, "Year must be greater than or equal to 1900")
      .max(
        new Date().getFullYear() + 1,
        "Year must be less than or equal to the current year"
      )
      .optional(),
  }),
});

export const YearValidation = {
  createYearZodSchema,
  updateYearZodSchema,
};
