import { z } from "zod";

const createWheelZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    year: z.string({
      required_error: "Year is required",
    }),
    make: z.string({
      required_error: "Make is required",
    }),
    model: z.string({
      required_error: "Model is required",
    }),
    trim: z.string({
      required_error: "Trim is required",
    }),
    tireSize: z.string({
      required_error: "Tire size is required",
    }),
    brand: z.string({
      required_error: "Brand is required",
    }),
    RimDiameter: z.number({
      required_error: "Rim diameter is required",
    }),
    RimWidth: z.number({
      required_error: "Rim width is required",
    }),
    boltPattern: z.string({
      required_error: "Bolt pattern is required",
    }),
    offset: z.number({
      required_error: "Offset is required",
    }),
    hubBoreSize: z.number({
      required_error: "Hub bore size is required",
    }),
    numberOFBolts: z.number({
      required_error: "Number of bolts is required",
    }),
    loadCapacity: z.number({
      required_error: "Load capacity is required",
    }),
    finish: z.string({
      required_error: "Finish is required",
    }),
    warranty: z.string({
      required_error: "Warranty is required",
    }),
    constructionType: z.string({
      required_error: "Construction type is required",
    }),
    wheelType: z.string({
      required_error: "Wheel type is required",
    }),
    category: z.string({
      required_error: "Category is required",
    }),
    wheelStockQuantity: z.number({
      required_error: "Wheel stock quantity is required",
    }),
    price: z.number({
      required_error: "Price is required",
    }),
    stockQuantity: z.number({
      required_error: "Stock quantity is required",
    }),
  }),
});

const updateWheelZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    year: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    trim: z.string().optional(),
    tireSize: z.string().optional(),
    brand: z.string().optional(),
    RimDiameter: z.number().optional(),
    RimWidth: z.number().optional(),
    boltPattern: z.string().optional(),
    offset: z.number().optional(),
    hubBoreSize: z.number().optional(),
    numberOFBolts: z.number().optional(),
    loadCapacity: z.number().optional(),
    finish: z.string().optional(),
    warranty: z.string().optional(),
    constructionType: z.string().optional(),
    wheelType: z.string().optional(),
    category: z.string().optional(),
    wheelStockQuantity: z.number().optional(),
    price: z.number().optional(),
    stockQuantity: z.number().optional(),
  }),
});

export const WheelValidation = {
  createWheelZodSchema,
  updateWheelZodSchema,
};
