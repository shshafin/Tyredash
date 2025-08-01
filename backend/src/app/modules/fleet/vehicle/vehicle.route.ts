import express from "express";
import auth from "../../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../../enum/user";
import validateRequest from "../../../middlewares/validateRequest";
import { FleetVehicleValidation } from "./vehicle.validation";
import { FleetVehicleController } from "./vehicle.controller";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FleetVehicleValidation.createFleetVehicleZodSchema),
  FleetVehicleController.createFleetVehicle
);

router.get("/:id", FleetVehicleController.getSingleFleetVehicle);

router.get("/", FleetVehicleController.getAllFleetVehicles);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FleetVehicleValidation.updateFleetVehicleZodSchema),
  FleetVehicleController.updateFleetVehicle
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetVehicleController.deleteFleetVehicle
);

export const FleetVehicleRoutes = router;
