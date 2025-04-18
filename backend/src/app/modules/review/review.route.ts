import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.createReview
);

router.get("/", ReviewController.getAllReviews);
router.get("/:id", ReviewController.getSingleReview);
router.get(
  "/product/:productId/:productType",
  ReviewController.getReviewsByProduct
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  validateRequest(ReviewValidation.updateReviewZodSchema),
  ReviewController.updateReview
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  ReviewController.deleteReview
);

export const ReviewRoutes = router;
