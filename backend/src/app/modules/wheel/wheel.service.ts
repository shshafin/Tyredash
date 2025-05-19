import { IWheel } from "./wheel.interface";
import { Wheel } from "./wheel.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { IWheelFilters } from "./wheel.interface";
import { Types } from "mongoose";
import { wheelSearchableFields } from "./wheel.constants";
import fs from "fs";
import csv from "csv-parser";
import { Year } from "../year/year.model";
import { Make } from "../makes/make.model";
import { CarModel } from "../models/model.model";
import { Trim } from "../trims/trim.model";
import { TireSize } from "../tire-size/tire-size.model";
import { Brand } from "../brand/brand.model";
import { Category } from "../category/category.model";
import { DrivingType } from "../driving-type/driving-type.model";

const createWheel = async (wheelData: IWheel): Promise<IWheel> => {
  const result = await Wheel.create(wheelData);
  return result;
};

const getAllWheels = async (
  filters: IWheelFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IWheel[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: wheelSearchableFields.map((field) => ({
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
        if (
          [
            "year",
            "make",
            "model",
            "trim",
            "tireSize",
            "drivingType",
            "brand",
            "category",
          ].includes(field)
        ) {
          if (!Types.ObjectId.isValid(String(value))) {
            throw new ApiError(httpStatus.BAD_REQUEST, `Invalid ${field} ID`);
          }
          return { [field]: new Types.ObjectId(String(value)) };
        }

        if (
          field === "price" ||
          field === "stockQuantity" ||
          field === "RimDiameter" ||
          field === "RimWidth" ||
          field === "offset" ||
          field === "hubBoreSize" ||
          field === "numberOFBolts" ||
          field === "loadCapacity"
        ) {
          return { [field]: Number(value) };
        }

        return { [field]: value };
      }),
    });
  }

  // Sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // Database query
  const result = await Wheel.find(whereConditions)
    .populate("year")
    .populate("make")
    .populate("model")
    .populate("trim")
    .populate("tireSize")
    .populate("drivingType")
    .populate("brand")
    .populate("category")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Wheel.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleWheel = async (id: string): Promise<IWheel | null> => {
  const result = await Wheel.findById(id).populate(
    "year make model trim tireSize brand category drivingType"
  );
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wheel not found");
  }
  return result;
};

const updateWheel = async (
  id: string,
  payload: Partial<IWheel>
): Promise<IWheel | null> => {
  const isExist = await Wheel.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wheel not found");
  }

  const result = await Wheel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate([
    { path: "year", select: "year" },
    { path: "make", select: "name" },
    { path: "model", select: "name" },
    { path: "trim", select: "name" },
    { path: "tireSize", select: "size" },
    { path: "drivingType", select: "title" },
    { path: "brand", select: "name" },
  ]);
  return result;
};

const deleteWheel = async (id: string): Promise<IWheel | null> => {
  const result = await Wheel.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wheel not found");
  }
  return result;
};

const uploadWheelCSV = async (filePath: string): Promise<any> => {
  const results: any[] = [];

  // Read the CSV file
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  // Iterate over each row of CSV data
  for (const row of results) {
    try {
      // Look up or insert the Year
      const year = await Year.findOneAndUpdate(
        { year: parseInt(row.year) },
        { $setOnInsert: { year: parseInt(row.year) } },
        { upsert: true, new: true }
      );

      // Look up or insert the Make
      const make = await Make.findOneAndUpdate(
        { make: row.make },
        { $setOnInsert: { make: row.make, logo: row.logo || "" } },
        { upsert: true, new: true }
      );

      // Look up or insert the Car Model
      const model = await CarModel.findOneAndUpdate(
        { model: row.model, make: make._id, year: year._id },
        { $setOnInsert: { model: row.model, make: make._id, year: year._id } },
        { upsert: true, new: true }
      );

      // Look up or insert the Trim
      const trim = await Trim.findOneAndUpdate(
        { trim: row.trim, model: model._id, make: make._id, year: year._id },
        {
          $setOnInsert: {
            trim: row.trim,
            model: model._id,
            make: make._id,
            year: year._id,
          },
        },
        { upsert: true, new: true }
      );

      // Look up or insert the Tire Size
      const tireSize = await TireSize.findOneAndUpdate(
        { tireSize: row.tireSize, trim: trim._id },
        {
          $setOnInsert: {
            tireSize: row.tireSize,
            trim: trim._id,
            model: model._id,
            make: make._id,
            year: year._id,
          },
        },
        { upsert: true, new: true }
      );

      // Look up or insert the Brand
      const brand = await Brand.findOneAndUpdate(
        { name: row.brand },
        {
          $setOnInsert: {
            name: row.brand,
            description: row.brandDescription || "",
            logo: row.brandLogo || "",
          },
        },
        { upsert: true, new: true }
      );

      // Look up or insert the Category
      const category = await Category.findOneAndUpdate(
        { name: row.category },
        {
          $setOnInsert: {
            name: row.category,
            slug: row.categorySlug || row.category.toLowerCase(),
            isActive: true,
          },
        },
        { upsert: true, new: true }
      );

      // Look up or insert the Driving Type
      const drivingType = await DrivingType.findOneAndUpdate(
        {
          title: row.drivingTypeTitle,
          subTitle: row.drivingTypeSubTitle,
        },
        {
          $setOnInsert: {
            title: row.drivingTypeTitle,
            subTitle: row.drivingTypeSubTitle,
            options: row.drivingTypeOptions
              ? row.drivingTypeOptions.split(",")
              : [],
          },
        },
        { upsert: true, new: true }
      );

      // Look up or insert the Wheel data
      await Wheel.findOneAndUpdate(
        {
          year: year._id,
          make: make._id,
          model: model._id,
          trim: trim._id,
          tireSize: tireSize._id,
          drivingType: drivingType?._id,
        },
        {
          $setOnInsert: {
            name: row.name,
            year: year._id,
            make: make._id,
            model: model._id,
            trim: trim._id,
            tireSize: tireSize._id,
            drivingType: drivingType?._id,
            brand: brand._id,
            category: category._id,
            description: row.description || "",
            images: row.images ? row.images.split(",") : [],
            productLine: row.productLine || "",
            unitName: row.unitName || "",
            grossWeight: row.grossWeight || "",
            conditionInfo: row.conditionInfo || "",
            GTIN: row.GTIN || "",
            ATVOffset: row.ATVOffset || "",
            BoltsQuantity: row.BoltsQuantity || "",
            wheelColor: row.wheelColor || "",
            hubBore: row.hubBore || "",
            materialType: row.materialType || "",
            wheelSize: row.wheelSize || "",
            wheelAccent: row.wheelAccent || "",
            wheelPieces: row.wheelPieces || "",
            wheelWidth: row.wheelWidth || "",
            RimDiameter: parseNumber(row.RimDiameter),
            RimWidth: parseNumber(row.RimWidth),
            boltPattern: row.boltPattern || "",
            offset: parseNumber(row.offset),
            hubBoreSize: parseNumber(row.hubBoreSize),
            numberOFBolts: parseNumber(row.numberOFBolts),
            loadCapacity: parseNumber(row.loadCapacity),
            loadRating: parseNumber(row.loadRating),
            finish: row.finish || "",
            warranty: row.warranty || "",
            constructionType: row.constructionType || "",
            wheelType: row.wheelType || "",
            price: parseNumber(row.price),
            discountPrice: parseNumber(row.discountPrice),
            stockQuantity: parseNumber(row.stockQuantity),
          },
        },
        { upsert: true }
      );
    } catch (error) {
      console.error(`Error processing row: ${JSON.stringify(row)}`, error);
    }
  }

  return { message: "CSV data processed successfully" };
};

function parseNumber(value: any): number {
  return isNaN(value) ? 0 : parseFloat(value);
}

export const WheelService = {
  createWheel,
  getAllWheels,
  getSingleWheel,
  updateWheel,
  deleteWheel,
  uploadWheelCSV,
};
