import { Model, Types } from "mongoose";

export interface IVehicleType {
  vehicleType: string;
}

export type IVehicleTypeModel = Model<IVehicleType, Record<string, unknown>>;
export type IVehicleTypeFilters = {
  searchTerm?: string;
};
