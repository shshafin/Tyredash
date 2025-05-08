import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { OrderService } from "./order.service";

import ApiError from "../../../errors/ApiError";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { orderFilterableFields } from "./order.constants";
import { ENUM_USER_ROLE } from "../../../enum/user";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.body;
  const order = await OrderService.createOrderFromPayment(paymentId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const userRole = req.user?.role;
  const userId = req.user?._id;

  const result = await OrderService.getAllOrders(
    filters,
    paginationOptions,
    userRole,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const userRole = req.user?.role;

  const order = await OrderService.getOrderById(id, userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrieved successfully",
    data: order,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, trackingNumber, estimatedDelivery } = req.body;

  // Only admin can update order status
  if (req.user?.role !== ENUM_USER_ROLE.ADMIN) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }

  const order = await OrderService.updateOrderStatus(
    id,
    status,
    trackingNumber,
    estimatedDelivery
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status updated successfully",
    data: order,
  });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const order = await OrderService.cancelOrder(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order cancelled successfully",
    data: order,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
