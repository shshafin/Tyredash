import { Model } from "mongoose";

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
}

export type IFleetSupportModel = Model<IFleetSupport, Record<string, unknown>>;
