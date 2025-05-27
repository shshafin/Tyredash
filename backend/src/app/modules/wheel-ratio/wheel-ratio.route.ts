import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { WheelRatioController } from "./wheel-ratio.controller";
import { WheelRatioValidation } from "./wheel-ratio.validation";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(WheelRatioValidation.create),
  WheelRatioController.createWheelRatio
);

router.get("/:id", WheelRatioController.getSingleWheelRatio);

router.get("/", WheelRatioController.getAllWheelRatio);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(WheelRatioValidation.update),
  WheelRatioController.updateWheelRatio
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  WheelRatioController.deleteWheelRatio
);

export const WheelRatioRoutes = router;
