import express from "express";

import validateRequest from "../../middlewares/validateRequest";
import { DrivingTypeValidation } from "./driving-type.validation";
import { DrivingTypeController } from "./driving-type.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(DrivingTypeValidation.createDrivingTypeZodSchema),
  DrivingTypeController.createDrivingType
);

router.get("/:id", DrivingTypeController.getSingleDrivingType);

router.get("/", DrivingTypeController.getAllDrivingTypes);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(DrivingTypeValidation.updateDrivingTypeZodSchema),
  DrivingTypeController.updateDrivingType
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  DrivingTypeController.deleteDrivingType
);

export const DrivingTypeRoutes = router;
