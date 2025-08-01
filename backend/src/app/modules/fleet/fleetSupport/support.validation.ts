// fleetSupport.validation.ts
import { z } from "zod";

const createFleetSupportZodSchema = z.object({
  body: z.object({
    issueType: z.enum(
      [
        "Billing Question",
        "Service Issue",
        "Account Access",
        "Technical Problem",
        "Appointment Scheduling",
        "Fleet Management",
        "Other",
      ],
      {
        required_error: "Issue type is required",
      }
    ),
    priority: z.enum(
      [
        "Low-General inquiry",
        "Medium-Service needed",
        "High-Urgent issue",
        "Critical-Emergency",
      ],
      {
        required_error: "Priority is required",
      }
    ),
    subject: z.string({
      required_error: "Subject is required",
    }),
    message: z.string({
      required_error: "Message is required",
    }),
    files: z.array(z.string()).optional(),
  }),
});

const updateFleetSupportZodSchema = z.object({
  body: z.object({
    issueType: z
      .enum([
        "Billing Question",
        "Service Issue",
        "Account Access",
        "Technical Problem",
        "Appointment Scheduling",
        "Fleet Management",
        "Other",
      ])
      .optional(),
    priority: z
      .enum([
        "Low-General inquiry",
        "Medium-Service needed",
        "High-Urgent issue",
        "Critical-Emergency",
      ])
      .optional(),
    subject: z.string().optional(),
    message: z.string().optional(),
    files: z.array(z.string()).optional(),
  }),
});

export const FleetSupportValidation = {
  createFleetSupportZodSchema,
  updateFleetSupportZodSchema,
};
