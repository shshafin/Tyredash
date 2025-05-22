export interface Deal {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  discountAmount: number;
  discountType: "percentage" | "fixed";
  applicableBrands: string[];
  termsAndConditions: string;
  isActive: boolean;
}
