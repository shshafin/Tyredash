import { Schema, model } from "mongoose";
import { IFleetSupport, IFleetSupportModel } from "./support.interface";

const fleetSupportSchema = new Schema<IFleetSupport, IFleetSupportModel>(
  {
    issueType: {
      type: String,
      required: true,
      enum: [
        "Billing Question",
        "Service Issue",
        "Account Access",
        "Technical Problem",
        "Appointment Scheduling",
        "Fleet Management",
        "Other",
      ],
    },
    priority: {
      type: String,
      required: true,
      enum: [
        "Low-General inquiry",
        "Medium-Service needed",
        "High-Urgent issue",
        "Critical-Emergency",
      ],
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    files: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const FleetSupport = model<IFleetSupport, IFleetSupportModel>(
  "FleetSupport",
  fleetSupportSchema
);
