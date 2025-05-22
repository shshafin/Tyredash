import express from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.createReview
);

router.get("/", ReviewController.getAllReviews);
router.get("/:id", ReviewController.getSingleReview);
router.get(
  "/product/:productId/:productType",
  ReviewController.getProductReviews
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(ReviewValidation.updateReviewZodSchema),
  ReviewController.updateReview
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN),
  ReviewController.deleteReview
);

export const ReviewRoutes = router;
