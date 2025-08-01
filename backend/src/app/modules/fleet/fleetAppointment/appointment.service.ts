import { SortOrder } from "mongoose";
import ApiError from "../../../../errors/ApiError";
import { deleteFile } from "../../../../helpers/fileHandlers";
import { paginationHelpers } from "../../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../../interfaces/common";
import { IPaginationOptions } from "../../../../interfaces/pagination";
import { fleetAppointmentSearchableFields } from "./appointment.constants";
import { IFleetAppointment } from "./appointment.interface";
import { FleetAppointment } from "./appointment.model";
import httpStatus from "http-status";

const createFleetAppointment = async (
  payload: IFleetAppointment
): Promise<IFleetAppointment> => {
  // Check for overlapping appointments for the same vehicle
  const existingAppointment = await FleetAppointment.findOne({
    fleetVehicle: payload.fleetVehicle,
    date: payload.date,
    time: payload.time,
    status: { $ne: "Cancelled" },
  });

  if (existingAppointment) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "An appointment already exists for this vehicle at the selected time"
    );
  }

  const result = await FleetAppointment.create(payload);
  return result;
};

const getAllFleetAppointments = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IFleetAppointment[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: fleetAppointmentSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await FleetAppointment.find(whereConditions)
    .populate("fleetVehicle")
    .populate("assignedTo")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await FleetAppointment.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleFleetAppointment = async (
  id: string
): Promise<IFleetAppointment | null> => {
  const result = await FleetAppointment.findById(id)
    .populate("fleetVehicle")
    .populate("assignedTo");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet appointment not found");
  }
  return result;
};

const updateFleetAppointment = async (
  id: string,
  payload: Partial<IFleetAppointment>
): Promise<IFleetAppointment | null> => {
  const isExist = await FleetAppointment.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet appointment not found");
  }

  // Check for overlapping appointments when updating time/date
  if (payload.date || payload.time) {
    const date = payload.date || isExist.date;
    const time = payload.time || isExist.time;
    const vehicleId = payload.fleetVehicle || isExist.fleetVehicle;

    const overlappingAppointment = await FleetAppointment.findOne({
      _id: { $ne: id },
      fleetVehicle: vehicleId,
      date,
      time,
      status: { $ne: "Cancelled" },
    });

    if (overlappingAppointment) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "An appointment already exists for this vehicle at the selected time"
      );
    }
  }

  const result = await FleetAppointment.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
    .populate("fleetVehicle")
    .populate("assignedTo");

  return result;
};

const deleteFleetAppointment = async (
  id: string
): Promise<IFleetAppointment | null> => {
  const result = await FleetAppointment.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet appointment not found");
  }

  // Delete associated files
  if (result.files && result.files.length > 0) {
    await Promise.allSettled(
      result.files.map(async (fileUrl) => {
        const filename = fileUrl.split("/").pop();
        if (filename) {
          await deleteFile(filename);
        }
      })
    );
  }

  return result;
};

// Additional Functions
const getAppointmentsByVehicle = async (
  vehicleId: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IFleetAppointment[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await FleetAppointment.find({ fleetVehicle: vehicleId })
    .populate("fleetVehicle")
    .populate("assignedTo")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await FleetAppointment.countDocuments({
    fleetVehicle: vehicleId,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateAppointmentStatus = async (
  id: string,
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled"
): Promise<IFleetAppointment | null> => {
  const result = await FleetAppointment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )
    .populate("fleetVehicle")
    .populate("assignedTo");

  return result;
};

const getUpcomingAppointments = async (
  days: number = 7
): Promise<IFleetAppointment[]> => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  const result = await FleetAppointment.find({
    date: {
      $gte: today.toISOString().split("T")[0],
      $lte: futureDate.toISOString().split("T")[0],
    },
    status: { $in: ["Pending", "Confirmed"] },
  })
    .populate("fleetVehicle")
    .populate("assignedTo")
    .sort({ date: 1, time: 1 });

  return result;
};

export const FleetAppointmentService = {
  createFleetAppointment,
  getAllFleetAppointments,
  getSingleFleetAppointment,
  updateFleetAppointment,
  deleteFleetAppointment,
  getAppointmentsByVehicle,
  updateAppointmentStatus,
  getUpcomingAppointments,
};
