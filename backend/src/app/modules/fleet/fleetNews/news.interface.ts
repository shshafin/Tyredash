import { Model } from "mongoose";

export interface IFleetNews {
  badge: string; // like as category
  title: string;
  description: string;
  status: "featured" | "recent";
}

export type FleetNewsModel = Model<IFleetNews, Record<string, unknown>>;

export interface IFleetNewsFilters {
  searchTerm?: string;
  badge?: string;
  title?: string;
  status?: "featured" | "recent";
}
