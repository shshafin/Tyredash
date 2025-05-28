import { model, Schema } from "mongoose";
import { IVehicleType, IVehicleTypeModel } from "./vehicle-type.interface";

const VehicleTypeSchema = new Schema<IVehicleType, IVehicleTypeModel>(
  {
    vehicleType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const VehicleType = model<IVehicleType, IVehicleTypeModel>(
  "VehicleType",
  VehicleTypeSchema
);
