import { Product } from "../product/product.model";
import { Deal } from "./deal.model";
import { Tire } from "../tire/tire.model";
import { Wheel } from "../wheel/wheel.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { SortOrder, Types } from "mongoose";
import { IDeal, IDealFilters } from "./deal.interface";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { dealSearchableFields } from "./deals.constant";

// Create a new deal
const createDeal = async (dealData: any): Promise<any> => {
  const result = await Deal.create(dealData);
  return result;
};

// Get deals for a specific brand
const getDealsForBrand = async (brandId: string): Promise<any[]> => {
  const currentDate = new Date();
  const deals = await Deal.find({
    brand: brandId,
    validFrom: { $lte: currentDate },
    validTo: { $gte: currentDate },
  });
  return deals;
};

// Get discounted tires by brand
const getDiscountedTiresByBrand = async (brandId: string): Promise<any[]> => {
  const deals = await getDealsForBrand(brandId);

  // Filter deals based on applicable products (tire)
  const tireDeals = deals.filter((deal) =>
    deal.applicableProducts.includes("tire")
  );

  const tires = await Tire.find({
    brand: brandId,
  });

  // Apply discounts to each tire based on the deals
  tireDeals.forEach((deal) => {
    tires.forEach((tire) => {
      const discountAmount = (tire.price * deal.discountPercentage) / 100;
      tire.discountPrice = tire.price - discountAmount;
      tire.save();
    });
  });

  return tires;
};

// Get discounted wheels by brand
const getDiscountedWheelsByBrand = async (brandId: string): Promise<any[]> => {
  const deals = await getDealsForBrand(brandId);

  // Filter deals based on applicable products (wheel)
  const wheelDeals = deals.filter((deal) =>
    deal.applicableProducts.includes("wheel")
  );

  const wheels = await Wheel.find({
    brand: brandId,
  });

  // Apply discounts to each wheel based on the deals
  wheelDeals.forEach((deal) => {
    wheels.forEach((wheel) => {
      const discountAmount = (wheel.price * deal.discountPercentage) / 100;
      wheel.discountPrice = wheel.price - discountAmount;
      wheel.save();
    });
  });

  return wheels;
};

// Get discounted products by brand (simple products)
const getDiscountedProductsByBrand = async (
  brandId: string
): Promise<any[]> => {
  const deals = await getDealsForBrand(brandId);

  // Filter deals based on applicable products (product)
  const productDeals = deals.filter((deal) =>
    deal.applicableProducts.includes("product")
  );

  const products = await Product.find({
    brand: brandId,
  });

  // Apply discounts to each product based on the deals
  productDeals.forEach((deal) => {
    products.forEach((product) => {
      const discountAmount = (product.price * deal.discountPercentage) / 100;
      product.discountPrice = product.price - discountAmount;
      product.save();
    });
  });

  return products;
};

// Apply discount to a tire
const applyDiscountToTire = async (tireId: string): Promise<any> => {
  const tire = await Tire.findById(tireId);
  if (!tire) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tire not found");
  }

  const applicableDeals = await getDealsForBrand(tire.brand.toString());

  applicableDeals.forEach((deal) => {
    const discountAmount = (tire.price * deal.discountPercentage) / 100;
    const discountedPrice = tire.price - discountAmount;
    tire.discountPrice = discountedPrice;
  });

  await tire.save();
  return tire;
};

// Apply discount to a wheel
const applyDiscountToWheel = async (wheelId: string): Promise<any> => {
  const wheel = await Wheel.findById(wheelId);
  if (!wheel) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wheel not found");
  }

  const applicableDeals = await getDealsForBrand(wheel.brand.toString());

  applicableDeals.forEach((deal) => {
    const discountAmount = (wheel.price * deal.discountPercentage) / 100;
    const discountedPrice = wheel.price - discountAmount;
    wheel.discountPrice = discountedPrice;
  });

  await wheel.save();
  return wheel;
};

// Apply discount to a simple product
const applyDiscountToProduct = async (productId: string): Promise<any> => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  if (!product.brand) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product brand is undefined");
  }

  const applicableDeals = await getDealsForBrand(product.brand.toString());

  applicableDeals.forEach((deal) => {
    const discountAmount = (product.price * deal.discountPercentage) / 100;
    const discountedPrice = product.price - discountAmount;
    product.discountPrice = discountedPrice;
  });

  await product.save();
  return product;
};

const getSingleDeal = async (id: string): Promise<IDeal | null> => {
  const result = await Deal.findById(id).populate("brand");

  return result;
};

const getAllDeals = async (
  filters: IDealFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IDeal[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: dealSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        // Handle ObjectId fields
        if (field === "brand") {
          return { [field]: new Types.ObjectId(String(value)) };
        }
        // Handle numeric fields
        if (field === "discountPercentage") {
          return { [field]: Number(value) };
        }
        // Handle date fields
        if (field === "validFrom" || field === "validTo") {
          return { [field]: new Date(String(value)) };
        }
        // Handle array fields
        if (field === "applicableProducts") {
          return { [field]: { $in: [value] } };
        }
        // Handle other fields
        return { [field]: value };
      }),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Deal.find(whereConditions)
    .populate("brand")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Deal.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateDeal = async (
  id: string,
  payload: Partial<IDeal>
): Promise<IDeal | null> => {
  const isExist = await Deal.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Deal not found");
  }

  const result = await Deal.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate("brand");

  return result;
};

const deleteDeal = async (id: string): Promise<IDeal | null> => {
  const result = await Deal.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Deal not found");
  }
  return result;
};

export const DealService = {
  createDeal,
  getDealsForBrand,
  getDiscountedTiresByBrand,
  getDiscountedWheelsByBrand,
  getDiscountedProductsByBrand,
  applyDiscountToTire,
  applyDiscountToWheel,
  applyDiscountToProduct,
  getSingleDeal,
  getAllDeals,
  updateDeal,
  deleteDeal,
};
