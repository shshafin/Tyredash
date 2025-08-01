import { Schema, model } from "mongoose";
import { IFLeetVehicle, IFleetVehicleModel } from "./vehicle.interface";

const fleetVehicleSchema = new Schema<IFLeetVehicle, IFleetVehicleModel>(
  {
    year: {
      type: String,
      required: true,
    },
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    vin: {
      type: String,
      required: true,
      unique: true,
    },
    licensePlate: {
      type: String,
      required: true,
      unique: true,
    },
    tireSize: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const FleetVehicle = model<IFLeetVehicle, IFleetVehicleModel>(
  "FleetVehicle",
  fleetVehicleSchema
);
