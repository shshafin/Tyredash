import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { TireWidthValidation } from "./tire-width.validation";
import { TireWidthController } from "./tire-width.controller";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(TireWidthValidation.create),
  TireWidthController.createTireWidth
);

router.get("/:id", TireWidthController.getSingleTireWidth);

router.get("/", TireWidthController.getAllTireWidth);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(TireWidthValidation.update),
  TireWidthController.updateTireWidth
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TireWidthController.deleteTireWidth
);

export const TireWidthRoutes = router;
