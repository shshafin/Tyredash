import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { VehicleTypeValidation } from "./vehicle-type.validation";
import { VehicleTypeController } from "./vehicle-type.controller";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(VehicleTypeValidation.create),
  VehicleTypeController.createVehicleType
);

router.get("/:id", VehicleTypeController.getSingleVehicleType);

router.get("/", VehicleTypeController.getAllVehicleType);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(VehicleTypeValidation.update),
  VehicleTypeController.updateVehicleType
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  VehicleTypeController.deleteVehicleType
);

export const VehicleTypeRoutes = router;
