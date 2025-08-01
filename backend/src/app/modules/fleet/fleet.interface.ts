export interface FleetUser {
  buisnessName: string;
  state: string;
  city: string;
  numberOfbuisnessYear: string;
  numberOFvehicles: string; // minimum 5
  moreLocation: boolean;
  centralLocation: boolean;
  fleetProgram: "Fleet Sales Specialist" | "Store" | "Website" | "Other";
  preferredLocation: boolean;
  additionalServices:
    | "Coast Fuel Savings"
    | "Discount Tire Telematics by Motorq"
    | "Revvo Smart Tire"
    | "Roadside Assistance by NSD"
    | "Spiffy Mobile Oil Change Service";
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
  phoneExtension: string;
  email: string;
  password: string;
  AdditionalComments: string;
}

export interface FLeetVehicle {
  year: string;
  make: string;
  model: string;
  vin: string;
  licensePlate: string;
  tireSize: string;
  note: string;
}

export interface FleetSupport {
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

export interface FleetNews {
  badge: string; // like as category
  title: string;
  description: string;
  status: "featured" | "resent";
}

export interface FleetAppointment {
  fLeetVehicle: string; // object id will add,
  serviceType:
    | "Tire Replacement"
    | " Flat Repair"
    | " Balance"
    | "  Rotation"
    | "other";

  date: string;
  time: string;
  address: string;
  notes: string;
  files: string[];
}
