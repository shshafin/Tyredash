import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { WheelWidthValidation } from "./wheel-width.validation";
import { WheelWidthController } from "./wheel-width.controller";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(WheelWidthValidation.create),
  WheelWidthController.createWheelWidth
);

router.get("/:id", WheelWidthController.getSingleWheelWidth);

router.get("/", WheelWidthController.getAllWheelWidth);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(WheelWidthValidation.update),
  WheelWidthController.updateWheelWidth
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  WheelWidthController.deleteWheelWidth
);

export const WheelWidthRoutes = router;
