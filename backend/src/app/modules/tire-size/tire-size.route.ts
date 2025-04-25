import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { TireSizeValidation } from "./tire-size-validation";
import { TireSizeController } from "./tire-size.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(TireSizeValidation.createTireSizeZodSchema),
  TireSizeController.createTireSize
);

router.get("/:id", TireSizeController.deleteTireSize);

router.get("/", TireSizeController.getAllTireSizes);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(TireSizeValidation.updateTireSizeZodSchema),
  TireSizeController.updateTireSize
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TireSizeController.deleteTireSize
);

export const TireSizeRoutes = router;
