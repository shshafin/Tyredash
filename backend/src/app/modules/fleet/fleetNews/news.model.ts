import { Schema, model } from "mongoose";
import { FleetNewsModel, IFleetNews } from "./news.interface";

const fleetNewsSchema = new Schema<IFleetNews, FleetNewsModel>(
  {
    badge: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["featured", "recent"],
      default: "recent",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const FleetNews = model<IFleetNews, FleetNewsModel>(
  "FleetNews",
  fleetNewsSchema
);
