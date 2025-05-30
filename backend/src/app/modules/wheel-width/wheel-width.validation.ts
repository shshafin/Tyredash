import { z } from "zod";

const create = z.object({
  body: z.object({
    width: z.string({
      required_error: "width is required",
    }),
  }),
});

const update = z.object({
  body: z.object({
    width: z.string().optional(),
  }),
});

export const WheelWidthValidation = {
  create,
  update,
};
