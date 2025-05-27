import { Model, Types } from "mongoose";

export interface ITireDiameter {
  diameter: string;
}

export type ITireDiameterModel = Model<ITireDiameter, Record<string, unknown>>;
export type ITireDiameterFilters = {
  searchTerm?: string;
};
