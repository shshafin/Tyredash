import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OrderController } from "./order.controller";
import { OrderValidation } from "./order.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder
);

router.get("/", auth(ENUM_USER_ROLE.ADMIN), OrderController.getAllOrders);

router.get("/my-orders", auth(), OrderController.getMyOrders);

router.get("/:id", auth(), OrderController.getOrderById);

router.patch(
  "/:id/status",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(OrderValidation.updateOrderStatusZodSchema),
  OrderController.updateOrderStatus
);

router.patch(
  "/:id/payment-result",
  auth(),
  validateRequest(OrderValidation.updatePaymentResultZodSchema),
  OrderController.updatePaymentResult
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), OrderController.deleteOrder);

export const OrderRoutes = router;
