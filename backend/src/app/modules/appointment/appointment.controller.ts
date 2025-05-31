import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { IAppointment } from "./appointment.interface";
import ApiError from "../../../errors/ApiError";
import { Appointment } from "./appointment.model";
import { appointmentFilterableFields } from "./appointmentFilterableFields";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const appointmentData = req.body;

  const result = await AppointmentService.createAppointment(appointmentData);

  sendResponse<IAppointment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment created successfully",
    data: result,
  });
});

const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, appointmentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AppointmentService.getAllAppointments(
    filters,
    paginationOptions
  );

  sendResponse<IAppointment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointments retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAppointment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AppointmentService.getSingleAppointment(id);

  sendResponse<IAppointment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment retrieved successfully",
    data: result,
  });
});

const updateAppointment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let { updatedData } = req.body;

  if (typeof updatedData === "string") {
    updatedData = JSON.parse(updatedData);
  }

  const existingAppointment = await Appointment.findById(id);
  if (!existingAppointment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found");
  }

  const result = await AppointmentService.updateAppointment(id, updatedData);

  sendResponse<IAppointment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment updated successfully",
    data: result,
  });
});

const deleteAppointment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found");
  }

  const result = await AppointmentService.deleteAppointment(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment deleted successfully",
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
  getAllAppointments,
  getSingleAppointment,
  updateAppointment,
  deleteAppointment,
};
