import express from "express";
import { DealController } from "./deal.controller";
import { uploadImage } from "../../../helpers/fileHandlers";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

// Route to get discounted tires by brand
router.get(
  "/discounted-tires/:brandId",
  DealController.getDiscountedTiresByBrand
);

// Route to get discounted wheels by brand
router.get(
  "/discounted-wheels/:brandId",
  DealController.getDiscountedWheelsByBrand
);

// Route to get discounted products by brand (Simple Products)
router.get(
  "/discounted-products/:brandId",
  DealController.getDiscountedProductsByBrand
);

// Route to apply a deal to a tire
router.post("/apply-deal-to-tire/:tireId", DealController.applyDealToTire);

// Route to apply a deal to a wheel
router.post("/apply-deal-to-wheel/:wheelId", DealController.applyDealToWheel);

// Route to apply a deal to a product
router.post(
  "/apply-deal-to-product/:productId",
  DealController.applyDealToProduct
);

// Route to create a new deal
router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadImage,
  DealController.createDeal
);
router.get("/:id", DealController.getSingleDeal);
router.get("/", DealController.getAllDeals);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadImage,
  DealController.updateDeal
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  DealController.deleteDeal
);

export const DealRoutes = router;
