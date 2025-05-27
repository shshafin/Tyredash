import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { TireDiameterValidation } from "./tire-diameter.validation";
import { TireDiameterController } from "./tire-diameter.controller";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(TireDiameterValidation.create),
  TireDiameterController.createTireDiameter
);

router.get("/:id", TireDiameterController.getSingleTireDiameter);

router.get("/", TireDiameterController.getAllTireDiameter);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(TireDiameterValidation.update),
  TireDiameterController.updateTireDiameter
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TireDiameterController.deleteTireDiameter
);

export const TireDiameterRoutes = router;
