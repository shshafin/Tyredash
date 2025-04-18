import { IOrder, OrderStatus } from "./order.interface";
import { Order } from "./order.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { Cart } from "../cart/cart.model";
import { orderSearchableFields } from "./order.constants";

const createOrder = async (
  userId: string,
  orderData: Partial<IOrder>
): Promise<IOrder> => {
  // Calculate itemsPrice from items
  const itemsPrice =
    orderData.items?.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ) || 0;

  const order = new Order({
    ...orderData,
    user: userId,
    itemsPrice,
    totalPrice:
      itemsPrice + (orderData.taxPrice || 0) + (orderData.shippingPrice || 0),
    status: OrderStatus.PENDING,
  });

  // Clear user's cart after creating order
  await Cart.findOneAndUpdate(
    { user: userId },
    { items: [], totalPrice: 0 },
    { new: true }
  );

  await order.save();
  return order;
};

const getAllOrders = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IOrder[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: orderSearchableFields.map((field) => ({
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

  const result = await Order.find(whereConditions)
    .populate("user")
    .populate("items.product")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getOrderById = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id)
    .populate("user")
    .populate("items.product");
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }
  return result;
};

const getUserOrders = async (userId: string): Promise<IOrder[]> => {
  const result = await Order.find({ user: userId })
    .populate("items.product")
    .sort({ createdAt: -1 });
  return result;
};

const updateOrderStatus = async (
  id: string,
  status: OrderStatus
): Promise<IOrder | null> => {
  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (order.status === OrderStatus.DELIVERED) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order already delivered");
  }

  if (status === OrderStatus.DELIVERED) {
    order.deliveredAt = new Date();
  }

  order.status = status;
  await order.save();
  return order;
};

const updatePaymentResult = async (
  id: string,
  paymentResult: any
): Promise<IOrder | null> => {
  const order = await Order.findByIdAndUpdate(
    id,
    {
      paymentResult,
      paidAt: new Date(),
    },
    { new: true }
  );
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }
  return order;
};

const deleteOrder = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }
  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  updatePaymentResult,
  deleteOrder,
};
