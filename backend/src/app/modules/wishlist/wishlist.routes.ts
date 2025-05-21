import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { WishlistController } from "./wishlist.controller";
import { WishlistValidation } from "./wishlist.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(WishlistValidation.createWishlistZodSchema),
  WishlistController.createWishlist
);

router.get(
  "/my-wishlist",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  WishlistController.getMyWishlist
);

router.post(
  "/items",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(WishlistValidation.addItemToWishlistZodSchema),
  WishlistController.addItemToWishlist
);

router.delete(
  "/items/:productId",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  WishlistController.removeItemFromWishlist
);

router.delete(
  "/clear",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  WishlistController.clearWishlist
);

export const WishlistRoutes = router;
