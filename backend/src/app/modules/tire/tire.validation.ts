import { z } from "zod";

const createTireZodSchema = z.object({
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
      required_error: "driving type is required",
    }),

    brand: z.string({
      required_error: "Brand is required",
    }),
    category: z.string({
      required_error: "Category is required",
    }),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    productLine: z.string().optional(),
    unitName: z.string().optional(),
    conditionInfo: z.string().optional(),
    grossWeightRange: z.string().optional(),
    gtinRange: z.string().optional(),
    loadIndexRange: z.string().optional(),
    mileageWarrantyRange: z.string().optional(),
    maxAirPressureRange: z.string().optional(),
    speedRatingRange: z.string().optional(),
    sidewallDescriptionRange: z.string().optional(),
    temperatureGradeRange: z.string().optional(),
    sectionWidthRange: z.string().optional(),
    diameterRange: z.number().optional(),
    wheelRimDiameterRange: z.string().optional(),
    tractionGradeRange: z.string().optional(),
    treadDepthRange: z.string().optional(),
    treadWidthRange: z.string().optional(),
    overallWidthRange: z.string().optional(),
    treadwearGradeRange: z.string().optional(),
    sectionWidth: z.number({
      required_error: "Section width is required",
    }),
    aspectRatio: z.number({
      required_error: "Aspect ratio is required",
    }),
    rimDiameter: z.number({
      required_error: "Rim diameter is required",
    }),
    overallDiameter: z.number({
      required_error: "Overall diameter is required",
    }),
    rimWidthRange: z.number({
      required_error: "Rim width range is required",
    }),
    width: z.number({
      required_error: "Width is required",
    }),
    treadDepth: z.number({
      required_error: "Tread depth is required",
    }),
    loadIndex: z.number({
      required_error: "Load index is required",
    }),
    loadRange: z.string({
      required_error: "Load range is required",
    }),
    maxPSI: z.number({
      required_error: "Max PSI is required",
    }),
    warranty: z.string({
      required_error: "Warranty is required",
    }),
    aspectRatioRange: z.string({
      required_error: "Aspect ratio range is required",
    }),
    treadPattern: z.string({
      required_error: "Tread pattern is required",
    }),
    loadCapacity: z.number({
      required_error: "Load capacity is required",
    }),
    constructionType: z.string({
      required_error: "Construction type is required",
    }),
    tireType: z.string({
      required_error: "Tire type is required",
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

const updateTireZodSchema = z.object({
  body: z.object({
    name: z.string().trim().optional(),
    year: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    trim: z.string().optional(),
    tireSize: z.string().optional(),
    brand: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    productLine: z.string().optional(),
    unitName: z.string().optional(),
    conditionInfo: z.string().optional(),
    grossWeightRange: z.string().optional(),
    gtinRange: z.string().optional(),
    loadIndexRange: z.string().optional(),
    mileageWarrantyRange: z.string().optional(),
    maxAirPressureRange: z.string().optional(),
    speedRatingRange: z.string().optional(),
    sidewallDescriptionRange: z.string().optional(),
    temperatureGradeRange: z.string().optional(),
    sectionWidthRange: z.string().optional(),
    diameterRange: z.number().optional(),
    wheelRimDiameterRange: z.string().optional(),
    tractionGradeRange: z.string().optional(),
    treadDepthRange: z.string().optional(),
    treadWidthRange: z.string().optional(),
    overallWidthRange: z.string().optional(),
    treadwearGradeRange: z.string().optional(),
    sectionWidth: z.number().optional(),
    aspectRatio: z.number().optional(),
    rimDiameter: z.number().optional(),
    overallDiameter: z.number().optional(),
    rimWidthRange: z.number().optional(),
    width: z.number().optional(),
    treadDepth: z.number().optional(),
    loadIndex: z.number().optional(),
    loadRange: z.string().optional(),
    maxPSI: z.number().optional(),
    warranty: z.string().optional(),
    aspectRatioRange: z.string().optional(),
    treadPattern: z.string().optional(),
    loadCapacity: z.number().optional(),
    constructionType: z.string().optional(),
    tireType: z.string().optional(),
    price: z.number().optional(),
    discountPrice: z.number().optional(),
    stockQuantity: z.number().optional(),
  }),
});

export const TireValidation = {
  createTireZodSchema,
  updateTireZodSchema,
};
