import express from "express";

import validateRequest from "../../middlewares/validateRequest";
import { DrivingTypeValidation } from "./driving-type.validation";
import { DrivingTypeController } from "./driving-type.controller";

const router = express.Router();

router.post(
  "/create",
  validateRequest(DrivingTypeValidation.createDrivingTypeZodSchema),
  DrivingTypeController.createDrivingType
);

router.get("/:id", DrivingTypeController.getSingleDrivingType);

router.get("/", DrivingTypeController.getAllDrivingTypes);

router.patch(
  "/:id",
  validateRequest(DrivingTypeValidation.updateDrivingTypeZodSchema),
  DrivingTypeController.updateDrivingType
);

router.delete("/:id", DrivingTypeController.deleteDrivingType);

export const DrivingTypeRoutes = router;
