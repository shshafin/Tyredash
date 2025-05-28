import { z } from "zod";

const create = z.object({
  body: z.object({
    widthType: z.string({
      required_error: "width type is required",
    }),
  }),
});

const update = z.object({
  body: z.object({
    width: z.string().optional(),
  }),
});

export const WheelWidthTypeValidation = {
  create,
  update,
};
