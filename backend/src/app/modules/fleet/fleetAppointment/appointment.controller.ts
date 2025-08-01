import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../shared/catchAsync";
import { deleteFile, getFileUrl } from "../../../../helpers/fileHandlers";
import { FleetAppointmentService } from "./appointment.service";
import { IFleetAppointment } from "./appointment.interface";
import sendResponse from "../../../../shared/sendResponse";
import pick from "../../../../shared/pick";
import { fleetAppointmentFilterableFields } from "./appointment.constants";
import { paginationFields } from "../../../../constants/pagination";
import { FleetAppointment } from "./appointment.model";
import ApiError from "../../../../errors/ApiError";

const createFleetAppointment = catchAsync(
  async (req: Request, res: Response) => {
    let { data } = req.body;

    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    if (req.files) {
      const files = (req.files as Express.Multer.File[]).map((file) =>
        getFileUrl(file.filename)
      );
      data.files = files;
    }

    const result = await FleetAppointmentService.createFleetAppointment(data);

    sendResponse<IFleetAppointment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Fleet appointment created successfully",
      data: result,
    });
  }
);

const getAllFleetAppointments = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, fleetAppointmentFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await FleetAppointmentService.getAllFleetAppointments(
      filters,
      paginationOptions
    );

    sendResponse<IFleetAppointment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Fleet appointments retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleFleetAppointment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await FleetAppointmentService.getSingleFleetAppointment(id);

    sendResponse<IFleetAppointment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Fleet appointment retrieved successfully",
      data: result,
    });
  }
);

const updateFleetAppointment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    let { updatedData } = req.body;

    if (typeof updatedData === "string") {
      updatedData = JSON.parse(updatedData);
    }

    const existingAppointment = await FleetAppointment.findById(id);
    if (!existingAppointment) {
      throw new ApiError(httpStatus.NOT_FOUND, "Fleet appointment not found");
    }

    if (req.files) {
      if (existingAppointment.files && existingAppointment.files.length > 0) {
        await Promise.all(
          existingAppointment.files.map(async (fileUrl) => {
            const filename = fileUrl.split("/").pop();
            if (filename) {
              deleteFile(filename);
            }
          })
        );
      }
      const newFiles = (req.files as Express.Multer.File[]).map((file) =>
        getFileUrl(file.filename)
      );
      updatedData.files = newFiles;
    }

    const result = await FleetAppointmentService.updateFleetAppointment(
      id,
      updatedData
    );

    sendResponse<IFleetAppointment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Fleet appointment updated successfully",
      data: result,
    });
  }
);

const deleteFleetAppointment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const appointment = await FleetAppointment.findById(id);

    if (!appointment) {
      throw new ApiError(httpStatus.NOT_FOUND, "Fleet appointment not found");
    }

    if (appointment.files?.length) {
      const deletionResults = await Promise.allSettled(
        appointment.files.map(async (fileUrl) => {
          const filename = fileUrl.split("/").pop();
          if (filename) {
            deleteFile(filename);
          }
        })
      );

      deletionResults.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(
            `Failed to delete file ${appointment.files?.[index]}:`,
            result.reason
          );
        }
      });
    }

    const result = await FleetAppointmentService.deleteFleetAppointment(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Fleet appointment deleted successfully",
      data: result,
    });
  }
);

// Additional Controllers
const getAppointmentsByVehicle = catchAsync(
  async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    const paginationOptions = pick(req.query, paginationFields);

    const result = await FleetAppointmentService.getAppointmentsByVehicle(
      vehicleId,
      paginationOptions
    );

    sendResponse<IFleetAppointment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Vehicle appointments retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const updateAppointmentStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await FleetAppointmentService.updateAppointmentStatus(
      id,
      status
    );

    sendResponse<IFleetAppointment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointment status updated successfully",
      data: result,
    });
  }
);

const getUpcomingAppointments = catchAsync(
  async (req: Request, res: Response) => {
    const days = req.query.days ? Number(req.query.days) : 7;
    const result = await FleetAppointmentService.getUpcomingAppointments(days);

    sendResponse<IFleetAppointment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Upcoming appointments retrieved successfully",
      data: result,
    });
  }
);

export const FleetAppointmentController = {
  createFleetAppointment,
  getAllFleetAppointments,
  getSingleFleetAppointment,
  updateFleetAppointment,
  deleteFleetAppointment,
  getAppointmentsByVehicle,
  updateAppointmentStatus,
  getUpcomingAppointments,
};
