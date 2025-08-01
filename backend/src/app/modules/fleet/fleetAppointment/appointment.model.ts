import { Schema, model } from "mongoose";
import {
  IFleetAppointment,
  IFleetAppointmentModel,
} from "./appointment.interface";

const fleetAppointmentSchema = new Schema<
  IFleetAppointment,
  IFleetAppointmentModel
>(
  {
    fleetVehicle: {
      type: Schema.Types.ObjectId,
      ref: "FleetVehicle",
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: ["Tire Replacement", "Flat Repair", "Balance", "Rotation", "Other"],
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    files: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    estimatedDuration: {
      type: Number, // in minutes
    },
    costEstimate: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const FleetAppointment = model<
  IFleetAppointment,
  IFleetAppointmentModel
>("FleetAppointment", fleetAppointmentSchema);
