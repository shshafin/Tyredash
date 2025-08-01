import express from "express";
import { ENUM_USER_ROLE } from "../../../../enum/user";
import { uploadFiles } from "../../../../helpers/fileHandlers";
import { FleetAppointmentValidation } from "./appointment.validation";
import validateRequest from "../../../middlewares/validateRequest";
import { FleetAppointmentController } from "./appointment.controller";
import auth from "../../../middlewares/auth";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  uploadFiles,
  validateRequest(FleetAppointmentValidation.createFleetAppointmentZodSchema),
  FleetAppointmentController.createFleetAppointment
);

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetAppointmentController.getAllFleetAppointments
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  FleetAppointmentController.getSingleFleetAppointment
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadFiles,
  validateRequest(FleetAppointmentValidation.updateFleetAppointmentZodSchema),
  FleetAppointmentController.updateFleetAppointment
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetAppointmentController.deleteFleetAppointment
);

// Additional Routes
router.get(
  "/vehicle/:vehicleId",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  FleetAppointmentController.getAppointmentsByVehicle
);

router.patch(
  "/:id/status",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetAppointmentController.updateAppointmentStatus
);

router.get(
  "/upcoming/appointments",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetAppointmentController.getUpcomingAppointments
);

export const FleetAppointmentRoutes = router;
