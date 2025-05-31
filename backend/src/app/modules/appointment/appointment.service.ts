import { Appointment } from "./appointment.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IAppointment, IAppointmentFilters } from "./appointment.interface";
import { SortOrder, Types } from "mongoose";

const createAppointment = async (
  appointmentData: IAppointment
): Promise<IAppointment> => {
  const result = await Appointment.create(appointmentData);
  return result;
};

const getAllAppointments = async (
  filters: IAppointmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAppointment[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: [
        { "user.firstName": { $regex: searchTerm, $options: "i" } },
        { "user.lastName": { $regex: searchTerm, $options: "i" } },
        { "user.email": { $regex: searchTerm, $options: "i" } },
        { "user.phoneNumber": { $regex: searchTerm, $options: "i" } },
      ],
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field === "schedule.date" || field === "status") {
          return { [field]: value };
        }
        return { [field]: new Types.ObjectId(String(value)) };
      }),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Appointment.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Appointment.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleAppointment = async (
  id: string
): Promise<IAppointment | null> => {
  const result = await Appointment.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found");
  }
  return result;
};

const updateAppointment = async (
  id: string,
  payload: Partial<IAppointment>
): Promise<IAppointment | null> => {
  const isExist = await Appointment.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found");
  }

  const result = await Appointment.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteAppointment = async (id: string): Promise<IAppointment | null> => {
  const result = await Appointment.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found");
  }
  return result;
};

export const AppointmentService = {
  createAppointment,
  getAllAppointments,
  getSingleAppointment,
  updateAppointment,
  deleteAppointment,
};
