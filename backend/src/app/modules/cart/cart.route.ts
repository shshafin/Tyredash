import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CartController } from "./cart.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { CartValidation } from "./cart.validation";

const router = express.Router();

// Create cart - should be automatic when user registers, but keeping for admin
router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CartValidation.createCartZodSchema),
  CartController.createCart
);

// Get all carts - admin only
router.get("/", auth(ENUM_USER_ROLE.ADMIN), CartController.getAllCarts);

// Get user's own cart - user access
// Get specific user's cart - admin access
router.get(
  "/:userId",
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  CartController.getCartByUserId
);

// Add item to cart - user can add to their own cart
router.post(
  "/:userId/items",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(CartValidation.addItemToCartZodSchema),
  CartController.addItemToCart
);

// Update cart item quantity - user can update their own cart
router.patch(
  "/:userId/items/:productId",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(CartValidation.updateCartItemZodSchema),
  CartController.updateItemQuantity // Note: renamed from updateCartItemQuantity
);

// Remove item from cart - user can modify their own cart
router.delete(
  "/:userId/items/:productId",
  auth(ENUM_USER_ROLE.USER),
  CartController.removeItemFromCart
);

// Clear cart - user can clear their own cart
router.delete(
  "/:userId/clear",
  auth(ENUM_USER_ROLE.USER),
  CartController.clearCart
);

export const CartRoutes = router;
