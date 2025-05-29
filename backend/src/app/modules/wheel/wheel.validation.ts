import { z } from "zod";

const createWheelZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .trim(),
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
    drivingType: z.string({
      required_error: "Driving type is required",
    }),
    brand: z.string({
      required_error: "Brand is required",
    }),
    category: z.string({
      required_error: "Category is required",
    }),
    width: z.string().optional(),
    ratio: z.string().optional(),
    diameter: z.string().optional(),
    vehicleType: z.string().optional(),
    widthType: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    productLine: z.array(z.string()).optional(),
    unitName: z.string().optional(),
    grossWeight: z.string().optional(),
    conditionInfo: z.string().optional(),
    GTIN: z.string().optional(),
    ATVOffset: z.string().optional(),
    BoltsQuantity: z.string().optional(),
    wheelColor: z.string().optional(),
    hubBore: z.string().optional(),
    materialType: z.string().optional(),
    wheelSize: z.string().optional(),
    wheelAccent: z.string().optional(),
    wheelPieces: z.string().optional(),
    rimDiameter: z.number({
      required_error: "Rim diameter is required",
    }),
    rimWidth: z.number({
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
    loadRating: z.number().optional(),
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
    wheelStockQuantity: z.number({
      required_error: "Wheel stock quantity is required",
    }),
    price: z.number({
      required_error: "Price is required",
    }),
    discountPrice: z.number().optional(),
    stockQuantity: z.number({
      required_error: "Stock quantity is required",
    }),
  }),
});

const updateWheelZodSchema = z.object({
  body: z.object({
    name: z.string().trim().optional(),
    year: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    trim: z.string().optional(),
    tireSize: z.string().optional(),
    brand: z.string().optional(),
    category: z.string().optional(),
    width: z.string().optional(),
    ratio: z.string().optional(),
    diameter: z.string().optional(),
    vehicleType: z.string().optional(),
    widthType: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    productLine: z.array(z.string()).optional(),
    unitName: z.string().optional(),
    grossWeight: z.string().optional(),
    conditionInfo: z.string().optional(),
    GTIN: z.string().optional(),
    ATVOffset: z.string().optional(),
    BoltsQuantity: z.string().optional(),
    wheelColor: z.string().optional(),
    hubBore: z.string().optional(),
    materialType: z.string().optional(),
    wheelSize: z.string().optional(),
    wheelAccent: z.string().optional(),
    wheelPieces: z.string().optional(),
    rimDiameter: z.number().optional(),
    rimWidth: z.number().optional(),
    boltPattern: z.string().optional(),
    offset: z.number().optional(),
    hubBoreSize: z.number().optional(),
    numberOFBolts: z.number().optional(),
    loadCapacity: z.number().optional(),
    loadRating: z.number().optional(),
    finish: z.string().optional(),
    warranty: z.string().optional(),
    constructionType: z.string().optional(),
    wheelType: z.string().optional(),
    wheelStockQuantity: z.number().optional(),
    price: z.number().optional(),
    discountPrice: z.number().optional(),
    stockQuantity: z.number().optional(),
  }),
});

export const WheelValidation = {
  createWheelZodSchema,
  updateWheelZodSchema,
};
