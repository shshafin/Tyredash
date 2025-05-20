// routes/mediaRoutes.ts
import express from "express";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

import { uploadController } from "./upload.controller";
import { uploadImages } from "../../../helpers/fileHandlers";

const router = express.Router();

router.post(
  "/images",
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadImages,
  uploadController.createMedia
);

export const UploadRoutes = router;
