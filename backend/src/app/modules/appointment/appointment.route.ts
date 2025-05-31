import express from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/create",
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AppointmentController.createAppointment
);

router.get("/", AppointmentController.getAllAppointments);

router.get("/:id", AppointmentController.getSingleAppointment);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  AppointmentController.updateAppointment
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  AppointmentController.deleteAppointment
);

export const AppointmentRoutes = router;
