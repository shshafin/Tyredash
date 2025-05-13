import Stripe from "stripe";

// Stripe Client
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export const paymentGateway = {
  stripe: stripeClient,
};
