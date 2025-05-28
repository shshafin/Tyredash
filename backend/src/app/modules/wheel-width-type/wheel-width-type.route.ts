import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { WheelWidthTypeValidation } from "./wheel-width-type.validation";
import { WheelWidthTypeController } from "./wheel-width-type.controller";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(WheelWidthTypeValidation.create),
  WheelWidthTypeController.createWheelWidthType
);

router.get("/:id", WheelWidthTypeController.getSingleWheelWidthType);

router.get("/", WheelWidthTypeController.getAllWheelWidthType);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(WheelWidthTypeValidation.update),
  WheelWidthTypeController.updateWheelWidthType
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  WheelWidthTypeController.deleteWheelWidthType
);

export const TireWidthTypeRoutes = router;
