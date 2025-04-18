import axios from "axios";

import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";

const getPayPalAccessToken = async (): Promise<string> => {
  try {
    const auth = Buffer.from(
      `${config.paypal_client_id}:${config.paypal_secret}`
    ).toString("base64");
    const { data } = await axios.post(
      `${config.paypal_api_url}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return data.access_token;
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Failed to get PayPal access token"
    );
  }
};

const verifyPayPalPayment = async (paymentId: string): Promise<boolean> => {
  const accessToken = await getPayPalAccessToken();
  try {
    const { data } = await axios.get(
      `${config.paypal_api_url}/v2/checkout/orders/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data.status === "COMPLETED";
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment verification failed");
  }
};

export const PayPalService = {
  verifyPayPalPayment,
};
