import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CartController } from "./cart.controller";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { CartValidation } from "./cart.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CartValidation.createCartZodSchema),
  CartController.createCart
);

router.get("/", auth(ENUM_USER_ROLE.ADMIN), CartController.getAllCarts);
router.get("/:userId", auth(), CartController.getCartByUserId);

router.post(
  "/:userId/items",
  auth(),
  validateRequest(CartValidation.addItemToCartZodSchema),
  CartController.addItemToCart
);

router.patch(
  "/:userId/items/:productId",
  auth(),
  validateRequest(CartValidation.updateCartItemZodSchema),
  CartController.updateCartItemQuantity
);

router.delete(
  "/:userId/items/:productId",
  auth(),
  CartController.removeItemFromCart
);

router.delete("/:userId/clear", auth(), CartController.clearCart);

export const CartRoutes = router;
