import { Model } from "mongoose";

export interface IFLeetVehicle {
  year: string;
  make: string;
  model: string;
  vin: string;
  licensePlate: string;
  tireSize: string;
  note: string;
}

export type IFleetVehicleModel = Model<IFLeetVehicle, Record<string, unknown>>;

export interface IFleetVehicleFilters {
  searchTerm?: string;
  year?: string;
  make?: string;
  model?: string;
  vin?: string;
  licensePlate?: string;
  tireSize?: string;
  note?: string;
}
