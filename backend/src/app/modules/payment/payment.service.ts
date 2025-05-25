import { Payment } from "./payment.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { Types } from "mongoose";
import { ICart } from "../cart/cart.interface";
import { Cart } from "../cart/cart.model";
import axios from "axios";
import config from "../../../config";
import { Tire } from "../tire/tire.model";
import Stripe from "stripe";

const stripe = new Stripe(config.stripe.secret_key || "", {
  apiVersion: "2025-04-30.basil",
});

import { Wheel } from "../wheel/wheel.model";
import { Product } from "../product/product.model";
import { OrderService } from "../order/order.service";
import { Order } from "../order/order.model";
import { CartService } from "../cart/cart.service";

const createPaymentIntent = async (
  userId: Types.ObjectId,
  cartId: Types.ObjectId,
  paymentMethod: "paypal" | "stripe",
  addressData: {
    billingAddress: any;
    shippingAddress: any;
  }
) => {
  // Fetch cart data
  const cart = await Cart.findOne({ _id: cartId, user: userId });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  if (cart.items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  // Dynamically populate each product based on productType
  const populatedItems = await Promise.all(
    cart.items.map(async (item) => {
      let populatedProduct;

      switch (item.productType) {
        case "tire":
          populatedProduct = await Tire.findById(item.product);
          break;
        case "wheel":
          populatedProduct = await Wheel.findById(item.product);
          break;
        case "product":
          populatedProduct = await Product.findById(item.product);
          break;
        default:
          throw new ApiError(httpStatus.BAD_REQUEST, "Invalid product type");
      }

      if (!populatedProduct) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
      }

      return {
        ...item,
        product: populatedProduct, // Attach the populated product
      };
    })
  );

  // Do not assign populatedItems to cart.items to avoid type errors

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
    await Payment.findByIdAndUpdate(payment._id, { paymentStatus: "failed" });
    throw error;
  }
};

const createStripePayment = async (payment: any, cart: ICart) => {
  try {
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        let productDetails = null;

        if (item.productType === "tire") {
          productDetails = await Tire.findById(item.product);
        } else if (item.productType === "wheel") {
          productDetails = await Wheel.findById(item.product);
        } else if (item.productType === "product") {
          productDetails = await Product.findById(item.product);
        }

        if (!productDetails) {
          throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
        }

        return {
          product: productDetails,
          productType: item.productType,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          thumbnail: item.thumbnail,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: populatedItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${config.frontend_url}/payment/success?paymentId=${payment._id}`,
      cancel_url: `${config.frontend_url}/payment/cancel?paymentId=${payment._id}`,
      metadata: {
        paymentId: payment._id.toString(),
        userId: payment.user.toString(),
        cartId: payment.cart.toString(),
      },
    });

    await Payment.findByIdAndUpdate(payment._id, {
      transactionId: session.id,
      paymentDetails: {
        sessionId: session.id,
        url: session.url,
      },
    });

    return {
      paymentId: payment._id,
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Stripe payment error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

// const createStripePayment = async (payment: any, cart: ICart) => {
//   try {
//     // Create a Stripe payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(payment.amount * 100), // Stripe uses cents
//       currency: "usd",
//       metadata: {
//         paymentId: payment._id.toString(),
//         userId: payment.user.toString(),
//         cartId: payment.cart.toString(),
//       },
//     });

//     // Update payment with Stripe details
//     await Payment.findByIdAndUpdate(payment._id, {
//       transactionId: paymentIntent.id,
//       paymentDetails: {
//         clientSecret: paymentIntent.client_secret,
//       },
//     });

//     return {
//       paymentId: payment._id,
//       clientSecret: paymentIntent.client_secret,
//       amount: payment.amount,
//       currency: "usd",
//     };
//   } catch (error) {
//     throw new ApiError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       `Stripe payment error: ${error instanceof Error ? error.message : "Unknown error"}`
//     );
//   }
// };

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

// const verifyStripePayment = async (paymentId: string, sessionId: string) => {
//   try {
//     // Retrieve the checkout session using the session ID
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     // The Payment Intent ID is part of the session object
//     const paymentIntentId = session.payment_intent;

//     if (!paymentIntentId) {
//       throw new Error("Payment Intent ID not found in the session.");
//     }

//     // Now you can use the paymentIntentId to verify the payment
//     const paymentIntent = await stripe.paymentIntents.retrieve(
//       typeof paymentIntentId === "string" ? paymentIntentId : paymentIntentId.id
//     );

//     if (paymentIntent.status === "succeeded") {
//       // Update payment status in your database
//       await Payment.findByIdAndUpdate(paymentId, {
//         paymentStatus: "completed",
//         paymentDetails: paymentIntent,
//       });

//       return { success: true, paymentIntent };
//     } else {
//       // Payment failed
//       console.log("Payment failed:", paymentIntent);
//       // Update payment status in your database
//       await Payment.findByIdAndUpdate(paymentId, {
//         paymentStatus: "failed",
//         paymentDetails: paymentIntent,
//       });

//       return { success: false, paymentIntent };
//     }
//   } catch (error) {
//     console.error("Stripe payment verification failed:", error);
//     throw new Error("Payment verification failed");
//   }
// };

const verifyStripePayment = async (paymentId: string, sessionId: string) => {
  try {
    // Retrieve the checkout session using the session ID
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // The Payment Intent ID is part of the session object
    const paymentIntentId = session.payment_intent;

    if (!paymentIntentId) {
      throw new Error("Payment Intent ID not found in the session.");
    }

    // Now you can use the paymentIntentId to verify the payment
    const paymentIntent = await stripe.paymentIntents.retrieve(
      typeof paymentIntentId === "string" ? paymentIntentId : paymentIntentId.id
    );

    if (paymentIntent.status === "succeeded") {
      // Payment was successful

      // Fetch the payment record from the database
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
      }

      // Fetch the cart from the database
      const cart = await Cart.findById(payment.cart);

      if (!cart) {
        throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
      }

      // Remove the items from the cart
      for (const item of cart.items) {
        await CartService.removeItemFromCart(
          payment.user.toString(),
          item.product.toString(),
          item.productType
        );
      }

      // Create an order based on the payment and cart data
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
        shippingAddress: payment.shippingAddress,
        billingAddress: payment.billingAddress,
        status: "pending",
      });

      // Update payment status to 'completed' and attach order details
      await Payment.findByIdAndUpdate(paymentId, {
        paymentStatus: "completed",
        paymentDetails: paymentIntent,
      });

      return { success: true, paymentIntent, order };
    } else {
      // Payment failed
      console.log("Payment failed:", paymentIntent);

      // Update payment status in your database
      await Payment.findByIdAndUpdate(paymentId, {
        paymentStatus: "failed",
        paymentDetails: paymentIntent,
      });

      return { success: false, paymentIntent };
    }
  } catch (error) {
    console.error("Stripe payment verification failed:", error);
    throw new Error("Payment verification failed");
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

// const handleSuccessfulPayment = async (payment: any) => {
//   // 1. Create an order record (you'll need an Order model)
//   // 2. Update product stock quantities
//   // 3. Clear the user's cart
//   const cart = await Cart.findById(payment.cart);

//   if (cart) {
//     // Update stock for each item in the cart
//     for (const item of cart.items) {
//       await updateProductStock(item.product, item.productType, item.quantity);
//     }

//     // Clear the cart
//     await Cart.findByIdAndUpdate(payment.cart, {
//       items: [],
//       totalPrice: 0,
//       totalItems: 0,
//     });
//   }
// };

const handleSuccessfulPayment = async (payment: any) => {
  // 1. Update product stock quantities
  const cart = await Cart.findById(payment.cart);

  if (cart) {
    for (const item of cart.items) {
      await updateProductStock(item.product, item.productType, item.quantity);
    }

    // 2. Create an order
    await OrderService.createOrderFromPayment(payment._id);

    // 3. Clear the cart
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
