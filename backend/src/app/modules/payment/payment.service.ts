import { IPayment, PaymentMethod, PaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { Order } from "../order/order.model";
import { paymentSearchableFields } from "./payment.constants";

const createPayment = async (
  userId: string,
  paymentData: Partial<IPayment>
): Promise<IPayment> => {
  // Verify the order exists and belongs to the user
  const order = await Order.findOne({
    _id: paymentData.order,
    user: userId,
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  const payment = await Payment.create({
    ...paymentData,
    user: userId,
    status: PaymentStatus.PENDING,
  });

  return payment;
};

const getAllPayments = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPayment[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: paymentSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Payment.find(whereConditions)
    .populate("user")
    .populate("order")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Payment.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getPaymentById = async (id: string): Promise<IPayment | null> => {
  const result = await Payment.findById(id).populate("user").populate("order");
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }
  return result;
};

const getUserPayments = async (userId: string): Promise<IPayment[]> => {
  const result = await Payment.find({ user: userId })
    .populate("order")
    .sort({ createdAt: -1 });
  return result;
};

const updatePaymentStatus = async (
  id: string,
  status: PaymentStatus,
  transactionId?: string
): Promise<IPayment | null> => {
  const payment = await Payment.findByIdAndUpdate(
    id,
    {
      status,
      ...(transactionId && { transactionId }),
    },
    { new: true }
  );

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }

  // Update order status if payment is completed
  if (status === PaymentStatus.COMPLETED) {
    await Order.findByIdAndUpdate(payment.order, {
      status: "processing",
      paidAt: new Date(),
    });
  }

  return payment;
};

const processPayment = async (
  userId: string,
  orderId: string,
  paymentData: {
    paymentMethod: PaymentMethod;
    paymentDetails: any;
  }
): Promise<IPayment> => {
  // In a real application, you would integrate with a payment gateway here
  // This is a simplified implementation

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Simulate payment processing
  const isPaymentSuccessful = Math.random() > 0.2; // 80% success rate for demo

  const payment = await Payment.create({
    order: orderId,
    user: userId,
    paymentMethod: paymentData.paymentMethod,
    amount: order.totalPrice,
    status: isPaymentSuccessful
      ? PaymentStatus.COMPLETED
      : PaymentStatus.FAILED,
    transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
    paymentDetails: paymentData.paymentDetails,
  });

  if (isPaymentSuccessful) {
    await Order.findByIdAndUpdate(orderId, {
      status: "processing",
      paidAt: new Date(),
    });
  }

  return payment;
};

const deletePayment = async (id: string): Promise<IPayment | null> => {
  const result = await Payment.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }
  return result;
};

export const PaymentService = {
  createPayment,
  getAllPayments,
  getPaymentById,
  getUserPayments,
  updatePaymentStatus,
  processPayment,
  deletePayment,
};
