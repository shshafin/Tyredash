import express from "express";

import validateRequest from "../../middlewares/validateRequest";
import { MakeController } from "./make.controller";
import { MakeValidation } from "./make.validation";
import { uploadImage } from "../../../helpers/fileHandlers";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadImage,
  validateRequest(MakeValidation.createMakeZodSchema),
  MakeController.createMake
);

router.get("/:id", MakeController.getSingleMake);

router.get("/", MakeController.getAllMakes);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadImage,
  validateRequest(MakeValidation.updateMakeZodSchema),
  MakeController.updateMake
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  MakeController.deleteMake
);

export const MakeRoutes = router;
