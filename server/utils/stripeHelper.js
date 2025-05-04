import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripePriceForPackage = async ({ name, description, amount }) => {
  const product = await stripe.products.create({
    name,
    description,
  });

  const price = await stripe.prices.create({
    unit_amount: amount * 100, // amount in cents
    currency: "usd",
    recurring: { interval: "month" },
    product: product.id,
  });

  return price.id;
};
