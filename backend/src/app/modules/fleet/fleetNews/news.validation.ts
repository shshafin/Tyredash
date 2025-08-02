import { z } from "zod";

const createFleetNewsZodSchema = z.object({
  body: z.object({
    badge: z.string({
      required_error: "Badge is required",
    }),
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    status: z.enum(["featured", "recent"]).optional(),
  }),
});

const updateFleetNewsZodSchema = z.object({
  body: z.object({
    badge: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["featured", "recent"]).optional(),
  }),
});

export const FleetNewsValidation = {
  createFleetNewsZodSchema,
  updateFleetNewsZodSchema,
};
