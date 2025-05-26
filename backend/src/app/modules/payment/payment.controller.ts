import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";

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

const getUserPaymentHistory = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id; // Assuming user is authenticated and user ID is available in req.user
    const filters = pick(req.query, [
      "paymentStatus",
      "paymentMethod",
      "startDate",
      "endDate",
    ]);
    const paginationOptions = pick(req.query, paginationFields);

    // Fetch the user's payment history
    const result = await PaymentService.userPaymentHistory(
      userId,
      filters,
      paginationOptions
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User payment history retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    "paymentStatus",
    "paymentMethod",
    "startDate",
    "endDate",
  ]);
  const paginationOptions = pick(req.query, paginationFields);

  // Admin access to all payments
  const result = await PaymentService.getAllPayments(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All payments retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const PaymentController = {
  createPayment,
  verifyStripePayment,
  verifyPaypalPayment,
  getPaymentDetails,
  getUserPaymentHistory,
  getAllPayments,
};
