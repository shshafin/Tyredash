import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { TrimController } from "./trim.controller";
import { TrimValidation } from "./trim.validation";
import multer from "multer";
import { FileUploadHelper } from "../../../helpers/FileUploadHelper";

const router = express.Router();

router.post(
  "/all",
  FileUploadHelper.upload.single("file"),
  TrimController.uploadCSV
);
router.post(
  "/create",
  validateRequest(TrimValidation.createTrimZodSchema),
  TrimController.createTrim
);

router.get("/:id", TrimController.getSingleTrim);

router.get("/", TrimController.getAllTrims);

router.patch(
  "/:id",
  validateRequest(TrimValidation.updateTrimZodSchema),
  TrimController.updateTrim
);

router.delete("/:id", TrimController.deleteTrim);

export const TrimRoutes = router;
