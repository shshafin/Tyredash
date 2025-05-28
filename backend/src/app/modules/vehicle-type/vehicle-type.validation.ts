import { z } from "zod";

const create = z.object({
  body: z.object({
    vehicleType: z.string({
      required_error: "Vehicle type is required",
    }),
  }),
});

const update = z.object({
  body: z.object({
    ratio: z.string().optional(),
  }),
});

export const VehicleTypeValidation = {
  create,
  update,
};
