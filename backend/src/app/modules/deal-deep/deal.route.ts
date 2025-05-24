import express from "express";
import { DealController } from "./deal.controller";
import auth from "../../middlewares/auth";

import validateRequest from "../../middlewares/validateRequest";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { DealValidation } from "./deal.validation";

const router = express.Router();

// ADMIN ROUTES
router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(DealValidation.createDealZodSchema),
  DealController.createDeal
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(DealValidation.updateDealZodSchema),
  DealController.updateDeal
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), DealController.deleteDeal);

router.get(
  "/admin/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  DealController.getSingleDeal
);

router.get("/admin", auth(ENUM_USER_ROLE.ADMIN), DealController.getAllDeals);

// CUSTOMER ROUTES
router.get("/active", DealController.getActiveDeals);

router.get(
  "/discounted/:brandId/:collection",
  DealController.getDiscountedItems
);

export default router;
