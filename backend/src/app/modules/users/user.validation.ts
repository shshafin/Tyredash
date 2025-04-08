import { z } from "zod";

const createUserZodSchema = z.object({
  body: z.object({
    role: z
      .string({
        required_error: "Role is required",
      })
      .default("user"),
    firstName: z.string({
      required_error: "First name is required",
    }),
    lastName: z.string({
      required_error: "Last name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    phone: z.string({
      required_error: "Phone number is required",
    }),
    addressLine1: z.string({
      required_error: "Address line 1 is required",
    }),
    addressLine2: z.string().optional(),
    zipCode: z.string({
      required_error: "Zip code is required",
    }),
    city: z.string({
      required_error: "City is required",
    }),
    state: z.string({
      required_error: "State is required",
    }),
    country: z.string({
      required_error: "Country is required",
    }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, "Password must be at least 8 characters"),
    needsPasswordChange: z.boolean().optional(),
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    zipCode: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    needsPasswordChange: z.boolean().optional(),
  }),
});

const loginUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  loginUserZodSchema,
};
