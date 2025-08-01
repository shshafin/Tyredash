import { Model, Types } from "mongoose";

export interface SupportResponse {
  user: Types.ObjectId;
  message: string;
  files?: string[];
  createdAt: Date;
}

export interface IFleetSupport {
  issueType:
    | "Billing Question"
    | " Service Issue"
    | "  Account Access"
    | " Technical Problem"
    | " Appointment Scheduling"
    | " Fleet Management"
    | "Other";

  priority:
    | "Low-General inquiry"
    | "Medium-Service needed"
    | "High-Urgent issue"
    | "Critical-Emergency";
  subject: string;
  message: string;
  files: string[];
  status?: "Open" | "In Progress" | "Resolved" | "Closed";
  user?: Types.ObjectId;
  responses?: SupportResponse[];
}

export type IFleetSupportModel = Model<IFleetSupport, Record<string, unknown>>;
