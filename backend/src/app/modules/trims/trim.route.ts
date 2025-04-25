import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { TrimController } from "./trim.controller";
import { TrimValidation } from "./trim.validation";
import multer from "multer";
import { FileUploadHelper } from "../../../helpers/FileUploadHelper";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/all",
  FileUploadHelper.upload.single("file"),
  TrimController.uploadCSV
);
router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(TrimValidation.createTrimZodSchema),
  TrimController.createTrim
);

router.get("/:id", TrimController.getSingleTrim);

router.get("/", TrimController.getAllTrims);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(TrimValidation.updateTrimZodSchema),
  TrimController.updateTrim
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TrimController.deleteTrim
);

export const TrimRoutes = router;
