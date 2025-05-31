import { Model, Types } from "mongoose";

export interface IAppointment {
  services: {
    mostPopularServices: {
      newTireWheelConsultation: boolean;
      tireInspection: boolean;
      tireRotationAndBalance: boolean;
      flatRepair: boolean;
    };
    otherServices: {
      webOrderInstallationPickUp: boolean;
      tirePressureMonitoringSystemService: boolean;
      winterTireChange: boolean;
      tireBalancing: boolean;
      fleetServices: boolean;
      wiperBladeServices: boolean;
    };
    additionalNotes?: string;
  };
  schedule: {
    date: string;
    time: string;
    planTo: "waitInStore" | "dropOff";
    someoneElseWillBringCar?: boolean;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
  };
  // If you have relationships, you can add them like this:
  // serviceCenter: Types.ObjectId;
  // assignedTechnician: Types.ObjectId;
  // customer: Types.ObjectId;
  status?: "pending" | "confirmed" | "completed" | "cancelled"; // example additional field
  createdAt?: Date;
  updatedAt?: Date;
}

export type IAppointmentModel = Model<IAppointment, Record<string, unknown>>;

export interface IAppointmentFilters {
  searchTerm?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  date?: string;
  status?: string;
  "services.mostPopularServices.newTireWheelConsultation"?: boolean;
  "services.mostPopularServices.flatRepair"?: boolean;
  // Add other filterable fields as needed
  [key: string]: any;
}
