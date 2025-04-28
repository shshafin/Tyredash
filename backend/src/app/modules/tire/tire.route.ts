import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { TireController } from "./tire.controller";
import { TireValidation } from "./tire.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { handleUploadError, uploadImages } from "../../../helpers/fileHandlers";

const router = express.Router();

// router.post(
//   "/",
//   auth(ENUM_USER_ROLE.ADMIN),
//   validateRequest(TireValidation.createTireZodSchema),
//   TireController.createTire
// );

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadImages,
  validateRequest(TireValidation.createTireZodSchema),
  TireController.createTire
);

router.get("/", TireController.getAllTires);
router.get("/:id", TireController.getSingleTire);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  uploadImages,
  validateRequest(TireValidation.updateTireZodSchema),
  TireController.updateTire
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), TireController.deleteTire);

export const TireRoutes = router;
