// fleetSupport.routes.ts
import express from "express";
import { ENUM_USER_ROLE } from "../../../../enum/user";
import auth from "../../../middlewares/auth";
import { uploadFiles } from "../../../../helpers/fileHandlers";
import validateRequest from "../../../middlewares/validateRequest";
import { FleetSupportValidation } from "./support.validation";
import { FleetSupportController } from "./support.controller";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  uploadFiles,
  validateRequest(FleetSupportValidation.createFleetSupportZodSchema),
  FleetSupportController.createFleetSupport
);

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetSupportController.getAllFleetSupports
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  FleetSupportController.getSingleFleetSupport
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadFiles,
  validateRequest(FleetSupportValidation.updateFleetSupportZodSchema),
  FleetSupportController.updateFleetSupport
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetSupportController.deleteFleetSupport
);

export const FleetSupportRoutes = router;
