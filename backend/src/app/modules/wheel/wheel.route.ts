import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { WheelController } from "./wheel.controller";
import { WheelValidation } from "./wheel.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { uploadImages } from "../../../helpers/fileHandlers";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadImages,
  // validateRequest(WheelValidation.createWheelZodSchema),
  WheelController.createWheel
);

router.get("/", WheelController.getAllWheels);
router.get("/:id", WheelController.getSingleWheel);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadImages,
  // validateRequest(WheelValidation.updateWheelZodSchema),
  WheelController.updateWheel
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  WheelController.deleteWheel
);

export const WheelRoutes = router;
