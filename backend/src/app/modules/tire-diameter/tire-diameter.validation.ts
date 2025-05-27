import { z } from "zod";

const create = z.object({
  body: z.object({
    diameter: z.string({
      required_error: "Diameter is required",
    }),
  }),
});

const update = z.object({
  body: z.object({
    ratio: z.string().optional(),
  }),
});

export const TireDiameterValidation = {
  create,
  update,
};
