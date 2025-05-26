import express from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/create-payment-intent",
  auth(ENUM_USER_ROLE.USER),
  PaymentController.createPayment
);

router.post(
  "/verify-stripe",
  auth(ENUM_USER_ROLE.USER),
  PaymentController.verifyStripePayment
);

router.post(
  "/verify-paypal",
  auth(ENUM_USER_ROLE.USER),
  PaymentController.verifyPaypalPayment
);

router.get(
  "/:paymentId",
  auth(ENUM_USER_ROLE.USER),
  PaymentController.getPaymentDetails
);

router.get(
  "/user/history",
  auth(ENUM_USER_ROLE.USER),
  PaymentController.getUserPaymentHistory
);

router.get(
  "/admin/history",
  auth(ENUM_USER_ROLE.ADMIN),
  PaymentController.getAllPayments
);

export const PaymentRoutes = router;
