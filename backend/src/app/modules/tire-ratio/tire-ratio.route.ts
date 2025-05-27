import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { TireRatioValidation } from "./tire-ratio.validation";
import { TireRatioController } from "./tire-ratio.controller";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(TireRatioValidation.create),
  TireRatioController.createTireRatio
);

router.get("/:id", TireRatioController.getSingleTireRatio);

router.get("/", TireRatioController.getAllTireRatio);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(TireRatioValidation.update),
  TireRatioController.updateTireRatio
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TireRatioController.deleteTireRatio
);

export const TireRatioRoutes = router;
