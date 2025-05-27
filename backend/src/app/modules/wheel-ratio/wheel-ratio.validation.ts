import { z } from "zod";

const create = z.object({
  body: z.object({
    ratio: z.string({
      required_error: "Width is required",
    }),
  }),
});

const update = z.object({
  body: z.object({
    ratio: z.string().optional(),
  }),
});

export const WheelRatioValidation = {
  create,
  update,
};
