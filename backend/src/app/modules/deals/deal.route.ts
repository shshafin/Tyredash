import express from "express";
import { DealController } from "./deal.controller";

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
router.post("/create", DealController.createDeal);

export default router;
