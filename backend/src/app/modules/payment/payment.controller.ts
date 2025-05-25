import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { cartId, paymentMethod, billingAddress, shippingAddress } = req.body;

  const result = await PaymentService.createPaymentIntent(
    userId,
    cartId,
    paymentMethod,
    { billingAddress, shippingAddress }
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment intent created successfully",
    data: result,
  });
});

const verifyStripePayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentId, sessionId } = req.body;
  const userId = req.user?.userId;

  // Verify the payment belongs to the user
  await PaymentService.getPaymentById(paymentId, userId.toString());

  const result = await PaymentService.verifyStripePayment(paymentId, sessionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.success
      ? "Payment verified successfully"
      : "Payment verification failed",
    data: result,
  });
});

const verifyPaypalPayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentId, orderId } = req.body;
  const userId = req.user?.userId;

  // Verify the payment belongs to the user
  await PaymentService.getPaymentById(paymentId, userId.toString());

  const result = await PaymentService.verifyPaypalPayment(paymentId, orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.success
      ? "Payment verified successfully"
      : "Payment verification failed",
    data: result,
  });
});

const getPaymentDetails = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const userId = req.user?.userId;

  const result = await PaymentService.getPaymentById(
    paymentId,
    userId.toString()
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment details retrieved successfully",
    data: result,
  });
});

export const PaymentController = {
  createPayment,
  verifyStripePayment,
  verifyPaypalPayment,
  getPaymentDetails,
};
