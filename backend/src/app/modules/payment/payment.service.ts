import { Payment } from "./payment.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { Types } from "mongoose";
import { ICart } from "../cart/cart.interface";
import { Cart } from "../cart/cart.model";
import axios from "axios";
import config from "../../../config";
import { Tire } from "../tire/tire.model"; // Import the Tire model
import { Wheel } from "../wheel/wheel.model";
import { Product } from "../product/product.model";

// Initialize PayPal and Stripe
const stripe = require("stripe")(config.stripe.secret_key);

export const createPaymentIntent = async (
  userId: Types.ObjectId,
  cartId: Types.ObjectId,
  paymentMethod: "paypal" | "stripe",
  addressData: {
    billingAddress: any;
    shippingAddress: any;
  }
) => {
  // Get the cart and verify it belongs to the user
  const cart = await Cart.findOne({ _id: cartId, user: userId }).populate(
    "items.product"
  );

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  if (cart.items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  // Create payment record
  const payment = await Payment.create({
    user: userId,
    cart: cartId,
    amount: cart.totalPrice,
    paymentMethod,
    paymentStatus: "pending",
    billingAddress: addressData.billingAddress,
    shippingAddress: addressData.shippingAddress,
  });

  try {
    if (paymentMethod === "stripe") {
      return await createStripePayment(payment, cart);
    } else {
      return await createPaypalPayment(payment, cart);
    }
  } catch (error) {
    // Update payment status to failed if something goes wrong
    await Payment.findByIdAndUpdate(payment._id, { paymentStatus: "failed" });
    throw error;
  }
};

const createStripePayment = async (payment: any, cart: ICart) => {
  try {
    // Create a Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(payment.amount * 100), // Stripe uses cents
      currency: "usd",
      metadata: {
        paymentId: payment._id.toString(),
        userId: payment.user.toString(),
        cartId: payment.cart.toString(),
      },
    });

    // Update payment with Stripe details
    await Payment.findByIdAndUpdate(payment._id, {
      transactionId: paymentIntent.id,
      paymentDetails: {
        clientSecret: paymentIntent.client_secret,
      },
    });

    return {
      paymentId: payment._id,
      clientSecret: paymentIntent.client_secret,
      amount: payment.amount,
      currency: "usd",
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Stripe payment error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

const createPaypalPayment = async (payment: any, cart: ICart) => {
  try {
    // Create PayPal order
    const paypalOrder = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: payment.amount.toFixed(2),
          },
          description: `Order for cart ${payment.cart}`,
        },
      ],
      application_context: {
        brand_name: "Tiredash",
        return_url: `${config.frontend_url}/payment/success?paymentId=${payment._id}`,
        cancel_url: `${config.frontend_url}/payment/cancel?paymentId=${payment._id}`,
      },
    };

    const response = await axios.post(
      `${config.paypal.base_url}/v2/checkout/orders`,
      paypalOrder,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getPaypalAccessToken()}`,
        },
      }
    );

    // Update payment with PayPal details
    await Payment.findByIdAndUpdate(payment._id, {
      transactionId: response.data.id,
      paymentDetails: {
        orderId: response.data.id,
        links: response.data.links,
      },
    });

    return {
      paymentId: payment._id,
      orderId: response.data.id,
      links: response.data.links,
      amount: payment.amount,
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `PayPal payment error: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

const getPaypalAccessToken = async () => {
  try {
    const response = await axios.post(
      `${config.paypal.base_url}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: config.paypal.client_id || "",
          password: config.paypal.secret || "",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to get PayPal access token"
    );
  }
};

export const verifyStripePayment = async (
  paymentId: string,
  paymentIntentId: string
) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
    }

    if (payment.paymentStatus !== "pending") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Payment already processed");
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      await Payment.findByIdAndUpdate(paymentId, {
        paymentStatus: "completed",
        paymentDetails: paymentIntent,
      });

      // Here you would typically create an order and clear the cart
      await handleSuccessfulPayment(payment);

      return { success: true, payment };
    } else {
      await Payment.findByIdAndUpdate(paymentId, {
        paymentStatus: "failed",
        paymentDetails: paymentIntent,
      });
      return { success: false, payment };
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Payment verification failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const verifyPaypalPayment = async (
  paymentId: string,
  orderId: string
) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
    }

    if (payment.paymentStatus !== "pending") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Payment already processed");
    }

    const accessToken = await getPaypalAccessToken();
    const response = await axios.get(
      `${config.paypal.base_url}/v2/checkout/orders/${orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.status === "COMPLETED") {
      await Payment.findByIdAndUpdate(paymentId, {
        paymentStatus: "completed",
        paymentDetails: response.data,
      });

      // Here you would typically create an order and clear the cart
      await handleSuccessfulPayment(payment);

      return { success: true, payment };
    } else {
      await Payment.findByIdAndUpdate(paymentId, {
        paymentStatus: "failed",
        paymentDetails: response.data,
      });
      return { success: false, payment };
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Payment verification failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

const handleSuccessfulPayment = async (payment: any) => {
  // 1. Create an order record (you'll need an Order model)
  // 2. Update product stock quantities
  // 3. Clear the user's cart
  const cart = await Cart.findById(payment.cart);

  if (cart) {
    // Update stock for each item in the cart
    for (const item of cart.items) {
      await updateProductStock(item.product, item.productType, item.quantity);
    }

    // Clear the cart
    await Cart.findByIdAndUpdate(payment.cart, {
      items: [],
      totalPrice: 0,
      totalItems: 0,
    });
  }
};

const updateProductStock = async (
  productId: Types.ObjectId,
  productType: string,
  quantity: number
) => {
  let model;
  switch (productType) {
    case "tire":
      model = Tire;
      break;
    case "wheel":
      model = Wheel;
      break;
    case "product":
      model = Product;
      break;
    default:
      throw new Error("Invalid product type");
  }

  if (model === Tire || model === Wheel || model === Product) {
    if (model === Tire) {
      await Tire.findByIdAndUpdate(productId, {
        $inc: { stockQuantity: -quantity },
      });
    } else if (model === Wheel) {
      await Wheel.findByIdAndUpdate(productId, {
        $inc: { stockQuantity: -quantity },
      });
    } else if (model === Product) {
      await Product.findByIdAndUpdate(productId, {
        $inc: { stockQuantity: -quantity },
      });
    } else {
      throw new Error("Invalid model type");
    }
  } else {
    throw new Error("Invalid model type");
  }
};

export const getPaymentById = async (paymentId: string, userId: string) => {
  const payment = await Payment.findOne({
    _id: paymentId,
    user: userId,
  }).populate("cart");

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }

  return payment;
};

export const PaymentService = {
  createPaymentIntent,
  verifyStripePayment,
  verifyPaypalPayment,
  getPaymentById,
};
