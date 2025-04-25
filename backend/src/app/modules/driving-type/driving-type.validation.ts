import { z } from "zod";

const createDrivingTypeZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    subTitle: z.string({
      required_error: "Subtitle is required",
    }),
    options: z.array(z.string()).nonempty({
      message: "Options array must not be empty",
    }),
  }),
});

const updateDrivingTypeZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    subTItle: z.string().optional(),
    options: z.array(z.string()).optional(),
  }),
});

export const DrivingTypeValidation = {
  createDrivingTypeZodSchema,
  updateDrivingTypeZodSchema,
};
