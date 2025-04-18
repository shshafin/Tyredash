import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import { IPayment } from "./payment.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { paymentFilterableFields } from "./payment.constants";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const paymentData = req.body;
  const result = await PaymentService.createPayment(userId, paymentData);

  sendResponse<IPayment>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, paymentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PaymentService.getAllPayments(
    filters,
    paginationOptions
  );

  sendResponse<IPayment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentService.getPaymentById(id);

  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const result = await PaymentService.getUserPayments(userId);

  sendResponse<IPayment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User payments retrieved successfully",
    data: result,
  });
});

const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, transactionId } = req.body;
  const result = await PaymentService.updatePaymentStatus(
    id,
    status,
    transactionId
  );

  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment status updated successfully",
    data: result,
  });
});

const processPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { orderId } = req.params;
  const paymentData = req.body;
  const result = await PaymentService.processPayment(
    userId,
    orderId,
    paymentData
  );

  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      result.status === "completed"
        ? "Payment processed successfully"
        : "Payment processing failed",
    data: result,
  });
});

const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentService.deletePayment(id);

  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment deleted successfully",
    data: result,
  });
});

export const PaymentController = {
  createPayment,
  getAllPayments,
  getPaymentById,
  getMyPayments,
  updatePaymentStatus,
  processPayment,
  deletePayment,
};
