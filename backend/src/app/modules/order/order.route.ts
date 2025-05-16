import express from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidation } from "./order.validation";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.USER),
  // validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder
);

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  OrderController.getAllOrders
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  OrderController.getOrderById
);

router.patch(
  "/:id/status",
  auth(ENUM_USER_ROLE.ADMIN),
  // validateRequest(OrderValidation.updateOrderStatusZodSchema),
  OrderController.updateOrderStatus
);

router.patch(
  "/:id/cancel",
  auth(ENUM_USER_ROLE.USER),
  OrderController.cancelOrder
);

export const OrderRoutes = router;
