import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BrandController } from "./brand.controller";
import { BrandValidation } from "./brand.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { uploadImage } from "../../../helpers/fileHandlers";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadImage,
  validateRequest(BrandValidation.createBrandZodSchema),
  BrandController.createBrand
);

router.get("/", BrandController.getAllBrands);
router.get("/:id", BrandController.getSingleBrand);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadImage,
  validateRequest(BrandValidation.updateBrandZodSchema),
  BrandController.updateBrand
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BrandController.deleteBrand
);

export const BrandRoutes = router;
