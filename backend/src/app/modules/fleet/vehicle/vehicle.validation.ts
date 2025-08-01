import { z } from "zod";

const createFleetVehicleZodSchema = z.object({
  body: z.object({
    year: z.string({
      required_error: "Year is required",
    }),
    make: z.string({
      required_error: "Make is required",
    }),
    model: z.string({
      required_error: "Model is required",
    }),
    vin: z.string({
      required_error: "VIN is required",
    }),
    licensePlate: z.string({
      required_error: "License plate is required",
    }),
    tireSize: z.string({
      required_error: "Tire size is required",
    }),
    note: z.string().optional(),
  }),
});

const updateFleetVehicleZodSchema = z.object({
  body: z.object({
    year: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    vin: z.string().optional(),
    licensePlate: z.string().optional(),
    tireSize: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const FleetVehicleValidation = {
  createFleetVehicleZodSchema,
  updateFleetVehicleZodSchema,
};
