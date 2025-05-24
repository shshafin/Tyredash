import { DealDeep } from "./deal.model";
import { Tire } from "../tire/tire.model";
import { Wheel } from "../wheel/wheel.model";
import { Product } from "../product/product.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { Types } from "mongoose";
import { IDealDeep, DealApplicableCollections } from "./deal.interface";

// ADMIN SERVICES
const createDeal = async (payload: IDealDeep): Promise<IDealDeep> => {
  if (
    !payload.applyTo.tires &&
    !payload.applyTo.wheels &&
    !payload.applyTo.products
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Deal must apply to at least one product type"
    );
  }
  return DealDeep.create(payload);
};

const updateDeal = async (
  dealId: string,
  updateData: Partial<IDealDeep>
): Promise<IDealDeep | null> => {
  const existingDeal = await DealDeep.findById(dealId);
  if (!existingDeal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Deal not found");
  }
  return DealDeep.findByIdAndUpdate(dealId, updateData, { new: true });
};

const deleteDeal = async (dealId: string): Promise<void> => {
  const result = await DealDeep.findByIdAndDelete(dealId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Deal not found");
  }
};

const getDealById = async (dealId: string): Promise<IDealDeep> => {
  const deal = await DealDeep.findById(dealId).populate("brand", "name logo");
  if (!deal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Deal not found");
  }
  return deal;
};

const getAllDeals = async (
  filters: Record<string, any>
): Promise<IDealDeep[]> => {
  return DealDeep.find(filters)
    .populate("brand", "name logo")
    .sort({ createdAt: -1 });
};

// CUSTOMER SERVICES
const getActiveDeals = async (brandId?: string): Promise<IDealDeep[]> => {
  const now = new Date();
  const query: any = {
    startDate: { $lte: now },
    endDate: { $gte: now },
    isActive: true,
  };
  if (brandId) query.brand = new Types.ObjectId(brandId);
  return DealDeep.find(query).populate("brand", "name logo");
};

const getDiscountedItems = async (
  brandId: string,
  collection: DealApplicableCollections
) => {
  const Model: any =
    collection === "tires" ? Tire : collection === "wheels" ? Wheel : Product;

  const [items, deals] = await Promise.all([
    Model.find({ brand: brandId }),
    getActiveDeals(brandId),
  ]);

  interface AppliedDeal {
    dealId: string;
    title: string;
    discountValue: number;
    discountType: "percentage" | "flat";
  }

  interface DiscountedItem {
    [key: string]: any;
    originalPrice: number;
    finalPrice: number;
    appliedDeals: AppliedDeal[];
  }

  const relevantDeals: IDealDeep[] = deals.filter(
    (deal: IDealDeep) => deal.applyTo[collection]
  );

  return items.map((item: any): DiscountedItem => {
    let finalPrice: number = item.price;
    const appliedDeals: AppliedDeal[] = [];

    for (const deal of relevantDeals) {
      const discountAmount: number =
        deal.discountType === "percentage"
          ? Math.min(
              item.price * (deal.discountValue / 100),
              deal.maxDiscount || Infinity
            )
          : deal.discountValue;

      finalPrice -= discountAmount;
      appliedDeals.push({
        dealId: deal._id as string,
        title: deal.title,
        discountValue: deal.discountValue,
        discountType:
          deal.discountType === "fixed" ? "flat" : deal.discountType,
      });
    }

    return {
      ...item.toObject(),
      originalPrice: item.price,
      finalPrice: Math.max(finalPrice, 0),
      appliedDeals,
    };
  });
};

export const DealService = {
  createDeal,
  updateDeal,
  deleteDeal,
  getDealById,
  getAllDeals,
  getActiveDeals,
  getDiscountedItems,
};
