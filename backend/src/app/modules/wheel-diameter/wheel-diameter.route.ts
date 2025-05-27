import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { WheelDiameterController } from "./wheel-diameter.controller";
import { WheelDiameterValidation } from "./wheel-diameter.validation";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(WheelDiameterValidation.create),
  WheelDiameterController.createWheelDiameter
);

router.get("/:id", WheelDiameterController.getSingleWheelDiameter);

router.get("/", WheelDiameterController.getAllWheelDiameter);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(WheelDiameterValidation.update),
  WheelDiameterController.updateWheelDiameter
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  WheelDiameterController.deleteWheelDiameter
);

export const WheelDiameterRoutes = router;
