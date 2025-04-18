import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { WishlistController } from "./wishlist.controller";
import { WishlistValidation } from "./wishlist.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(WishlistValidation.createWishlistZodSchema),
  WishlistController.createWishlist
);

router.get("/my-wishlist", auth(), WishlistController.getMyWishlist);

router.post(
  "/items",
  auth(),
  validateRequest(WishlistValidation.addItemToWishlistZodSchema),
  WishlistController.addItemToWishlist
);

router.delete(
  "/items/:productId",
  auth(),
  WishlistController.removeItemFromWishlist
);

router.delete("/clear", auth(), WishlistController.clearWishlist);

export const WishlistRoutes = router;
