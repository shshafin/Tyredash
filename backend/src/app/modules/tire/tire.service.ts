import { Tire } from "./tire.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder, Types } from "mongoose";
import { ITire, ITireFilters } from "./tire.interface";
import { tireSearchableFields } from "./tire.constants";
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
import { TireWidth } from "../tire-width/tire-width.model";
import { TireRatio } from "../tire-ratio/tire-ratio.model";
import { TireDiameter } from "../tire-diameter/tire-diameter.model";
import { VehicleType } from "../vehicle-type/vehicle-type.model";

const createTire = async (tireData: ITire): Promise<ITire> => {
  const result = await Tire.create(tireData);
  return result;
};

const getAllTires = async (
  filters: ITireFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITire[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: tireSearchableFields.map((field) => ({
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
            "width",
            "ratio",
            "diameter",
            "vehicleType",
          ].includes(field)
        ) {
          return { [field]: new Types.ObjectId(String(value)) };
        }
        // Handle numeric fields
        if (
          field === "price" ||
          field === "stockQuantity" ||
          field === "sectionWidth" ||
          field === "rimDiameter" ||
          field === "loadIndex"
        ) {
          return { [field]: Number(value) };
        }
        // Handle other fields
        return { [field]: value };
      }),
    });
  }

  // Rest of your code remains the same...
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Tire.find(whereConditions)
    .populate("year")
    .populate("make")
    .populate("model")
    .populate("trim")
    .populate("tireSize")
    .populate("drivingType")
    .populate("brand")
    .populate("category")
    .populate("width")
    .populate("ratio")
    .populate("diameter")
    .populate("vehicleType")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Tire.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleTire = async (id: string): Promise<ITire | null> => {
  const result = await Tire.findById(id).populate(
    "year make model trim tireSize brand category drivingType width ratio diameter vehicleType"
  );
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tire not found");
  }
  return result;
};

const updateTire = async (
  id: string,
  payload: Partial<ITire>
): Promise<ITire | null> => {
  const isExist = await Tire.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tire not found");
  }

  const result = await Tire.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
    .populate("year")
    .populate("make")
    .populate("model")
    .populate("trim")
    .populate("tireSize")
    .populate("drivingType")
    .populate("brand")
    .populate("category")
    .populate("width")
    .populate("ratio")
    .populate("diameter")
    .populate("vehicleType");

  return result;
};

const deleteTire = async (id: string): Promise<ITire | null> => {
  const result = await Tire.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tire not found");
  }
  return result;
};

const parseNumber = (value: any, defaultValue = 0): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

const uploadCSVTires = async (filePath: string): Promise<any> => {
  const results: any[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  for (const row of results) {
    try {
      const year = await Year.findOneAndUpdate(
        { year: parseInt(row.year) },
        { $setOnInsert: { year: parseInt(row.year) } },
        { upsert: true, new: true }
      );

      const make = await Make.findOneAndUpdate(
        { make: row.make },
        { $setOnInsert: { make: row.make, logo: row.logo || "" } },
        { upsert: true, new: true }
      );

      const model = await CarModel.findOneAndUpdate(
        { model: row.model, make: make._id, year: year._id },
        { $setOnInsert: { model: row.model, make: make._id, year: year._id } },
        { upsert: true, new: true }
      );

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

      const tireSize = await TireSize.findOneAndUpdate(
        {
          tireSize: row.tireSize,
          model: model._id,
          make: make._id,
          year: year._id,
          trim: trim._id,
        },
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

      const width = await TireWidth.findOneAndUpdate(
        { width: row.width },
        { $setOnInsert: { width: row.width } },
        { upsert: true, new: true }
      );

      const ratio = await TireRatio.findOneAndUpdate(
        { ratio: row.ratio },
        { $setOnInsert: { ratio: row.ratio } },
        { upsert: true, new: true }
      );

      const diameter = await TireDiameter.findOneAndUpdate(
        { diameter: row.diameter },
        { $setOnInsert: { diameter: row.diameter } },
        { upsert: true, new: true }
      );

      const vehicleType = await VehicleType.findOneAndUpdate(
        { vehicleType: row.vehicleType },
        { $setOnInsert: { vehicleType: row.vehicleType } },
        { upsert: true, new: true }
      );

      await Tire.findOneAndUpdate(
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
            width: width._id,
            ratio: ratio._id,
            diameter: diameter._id,
            vehicleType: vehicleType._id,
            description: row.description || "",
            images: row.images ? row.images.split(",") : [],
            productLine: row.productLine || "",
            unitName: row.unitName || "",
            conditionInfo: row.conditionInfo || "",
            grossWeightRange: row.grossWeightRange || "",
            gtinRange: row.gtinRange || "",
            loadIndexRange: row.loadIndexRange || "",
            mileageWarrantyRange: row.mileageWarrantyRange || "",
            maxAirPressureRange: row.maxAirPressureRange || "",
            speedRatingRange: row.speedRatingRange || "",
            sidewallDescriptionRange: row.sidewallDescriptionRange || "",
            temperatureGradeRange: row.temperatureGradeRange || "",
            sectionWidthRange: row.sectionWidthRange || "",
            wheelRimDiameterRange: row.wheelRimDiameterRange || "",
            tractionGradeRange: row.tractionGradeRange || "",
            treadDepthRange: row.treadDepthRange || "",
            treadWidthRange: row.treadWidthRange || "",
            overallWidthRange: row.overallWidthRange || "",
            treadwearGradeRange: row.treadwearGradeRange || "",
            sectionWidth: parseNumber(row.sectionWidth),
            rimDiameter: parseNumber(row.rimDiameter),
            overallDiameter: parseNumber(row.overallDiameter),
            rimWidthRange: parseNumber(row.rimWidthRange),
            treadDepth: parseNumber(row.treadDepth),
            loadIndex: parseNumber(row.loadIndex),
            loadRange: row.loadRange || "",
            maxPSI: parseNumber(row.maxPSI),
            warranty: row.warranty || "",
            aspectRatioRange: row.aspectRatioRange || "",
            treadPattern: row.treadPattern || "",
            loadCapacity: parseNumber(row.loadCapacity),
            constructionType: row.constructionType || "",
            tireType: row.tireType || "",
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

export const TireService = {
  createTire,
  getAllTires,
  getSingleTire,
  updateTire,
  deleteTire,
  uploadCSVTires,
};
