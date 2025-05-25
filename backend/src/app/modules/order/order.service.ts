import { Order } from "./order.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

import { Payment } from "../payment/payment.model";
import { Cart } from "../cart/cart.model";
import { Types } from "mongoose";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { orderFilterableFields } from "./order.constants";
import { SortOrder } from "mongoose";
import { Tire } from "../tire/tire.model";
import { Wheel } from "../wheel/wheel.model";
import { Product } from "../product/product.model";
import { IOrder, OrderStatus } from "./order.interface";

const createOrderFromPayment = async (
  paymentId: Types.ObjectId
): Promise<IOrder> => {
  const payment = await Payment.findById(paymentId).populate("cart");

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.paymentStatus !== "completed") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment not completed");
  }

  const cart = await Cart.findById(payment.cart);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  // Create the order
  const order = await Order.create({
    user: payment.user,
    payment: payment._id,
    items: cart.items.map((item) => ({
      product: item.product,
      productType: item.productType,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      thumbnail: item.thumbnail,
    })),
    totalPrice: cart.totalPrice,
    totalItems: cart.totalItems,
    status: "processing",
    shippingAddress: payment.shippingAddress,
    billingAddress: payment.billingAddress,
  });

  return order;
};

const getAllOrders = async (
  filters: any,
  paginationOptions: IPaginationOptions,
  userRole: string,
  userId?: Types.ObjectId
): Promise<IGenericResponse<IOrder[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search term conditions
  if (searchTerm) {
    andConditions.push({
      $or: orderFilterableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Filters data conditions
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // For customers, only show their own orders
  if (userRole === "user" && userId) {
    andConditions.push({ user: userId });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Order.find(whereConditions)
    .populate("user")
    .populate("payment")
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

// const getOrderById = async (
//   orderId: string,
//   userId: Types.ObjectId,
//   userRole: string
// ): Promise<IOrder> => {
//   let order;

//   if (userRole === "admin") {
//     order = await Order.findById(orderId).populate("user").populate("payment");
//   } else {
//     order = await Order.findOne({
//       _id: orderId,
//       user: userId,
//     })
//       .populate("user")
//       .populate("payment");
//   }

//   if (!order) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
//   }

//   // Convert Mongoose document to plain object
//   const orderObject = order.toObject();

//   // Populate product details for each item
//   const populatedItems = await Promise.all(
//     orderObject.items.map(async (item: any) => {
//       let productDetails;
//       switch (item.productType) {
//         case "tire":
//           productDetails = await Tire.findById(item.product).lean();
//           break;
//         case "wheel":
//           productDetails = await Wheel.findById(item.product).lean();
//           break;
//         case "product":
//           productDetails = await Product.findById(item.product).lean();
//           break;
//       }

//       return {
//         ...item,
//         productDetails,
//       };
//     })
//   );

//   return {
//     ...orderObject,
//     items: populatedItems,
//   } as unknown as IOrder;
// };

const getOrderById = async (
  orderId: string,
  userId: Types.ObjectId,
  userRole: string
): Promise<IOrder> => {
  let order: IOrder | null;

  if (userRole === "admin") {
    order = await Order.findById(orderId).populate("user").populate("payment");
  } else {
    order = await Order.findOne({
      _id: orderId,
      user: userId,
    })
      .populate("user")
      .populate("payment");
  }

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Convert to plain object to avoid Mongoose document methods
  const orderPlainObject = order.toObject();

  // Populate product details for each item
  interface IOrderItem {
    product: Types.ObjectId;
    productType: string;
    quantity: number;
    price: number;
    name: string;
    thumbnail: string;
  }

  interface IOrderItemWithDetails extends IOrderItem {
    productDetails: any; // Replace `any` with a specific type if available for product details
  }

  const populatedItems: IOrderItemWithDetails[] = await Promise.all(
    orderPlainObject.items.map(
      async (item: IOrderItem): Promise<IOrderItemWithDetails> => {
        let productDetails: any; // Replace `any` with a specific type if available for product details
        switch (item.productType) {
          case "tire":
            productDetails = await Tire.findById(item.product).lean();
            break;
          case "wheel":
            productDetails = await Wheel.findById(item.product).lean();
            break;
          case "product":
            productDetails = await Product.findById(item.product).lean();
            break;
        }

        return {
          ...item,
          productDetails,
        };
      }
    )
  );

  // Create a new object that matches IOrder interface
  const result: IOrder = {
    ...orderPlainObject,
    items: populatedItems,
    // Explicitly include all required IOrder properties
    user: orderPlainObject.user,
    payment: orderPlainObject.payment,
    totalPrice: orderPlainObject.totalPrice,
    totalItems: orderPlainObject.totalItems,
    status: orderPlainObject.status,
    shippingAddress: orderPlainObject.shippingAddress,
    billingAddress: orderPlainObject.billingAddress,
    createdAt: orderPlainObject.createdAt,
    updatedAt: orderPlainObject.updatedAt,
    // Add any other required properties from IOrder
  };

  return result;
};

const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  estimatedDelivery?: Date
): Promise<IOrder> => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  const updateData: any = { status };

  if (trackingNumber) {
    updateData.trackingNumber = trackingNumber;
  }

  if (estimatedDelivery) {
    updateData.estimatedDelivery = estimatedDelivery;
  }

  const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
  })
    .populate("user")
    .populate("payment");

  if (!updatedOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  return updatedOrder;
};

const cancelOrder = async (
  orderId: string,
  userId: Types.ObjectId
): Promise<IOrder> => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Only allow cancellation if order hasn't been shipped yet
  if (["shipped", "delivered"].includes(order.status)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot cancel order that has already been shipped"
    );
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status: "cancelled" },
    { new: true }
  )
    .populate("user")
    .populate("payment");

  if (!updatedOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Here you would typically initiate a refund if payment was made
  // and restock the products

  return updatedOrder;
};

export const OrderService = {
  createOrderFromPayment,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
