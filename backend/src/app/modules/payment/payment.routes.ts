import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(PaymentValidation.createPaymentZodSchema),
  PaymentController.createPayment
);

router.post(
  "/process/:orderId",
  auth(),
  validateRequest(PaymentValidation.processPaymentZodSchema),
  PaymentController.processPayment
);

router.get("/", auth(ENUM_USER_ROLE.ADMIN), PaymentController.getAllPayments);

router.get("/my-payments", auth(), PaymentController.getMyPayments);

router.get("/:id", auth(), PaymentController.getPaymentById);

router.patch(
  "/:id/status",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(PaymentValidation.updatePaymentStatusZodSchema),
  PaymentController.updatePaymentStatus
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  PaymentController.deletePayment
);

export const PaymentRoutes = router;
