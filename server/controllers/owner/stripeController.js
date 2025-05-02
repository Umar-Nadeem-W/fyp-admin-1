import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import db from "../../config/dbconfig.js";

const prices = {
  basic: "price_1RJGrtLKDEs1cWKCo8mMA1j7",    
  premium: "price_1RJGsSLKDEs1cWKC8K6ZmExk",
  proplus: "price_1RJGt7LKDEs1cWKCXILiIo2d",
};

export const createCheckoutSession = async (req, res) => {
  const { plan } = req.body;

  try {
    if (!prices[plan]) {
      return res.status(400).json({ error: "Invalid Plan Selected" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: prices[plan],
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/subcriptionpage?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/subcriptionpage?payment=cancel`,
    });

    res.status(200).json({ sessionId: session.id }); // <-- send sessionId not url
  } catch (error) {
    console.error("Error creating checkout session", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const handleStripeWebhook = async (req, res) => {
  console.log("Webhook called!");
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Assume email maps to farm_owner
    const customerEmail = session.customer_email;

    const [farmOwnerRows] = await db.query(
      "SELECT id FROM farm_owner WHERE email = ?",
      [customerEmail]
    );

    if (farmOwnerRows.length === 0) {
      console.error("No farm_owner found with email:", customerEmail);
      return res.sendStatus(404);
    }

    const subscriber_id = farmOwnerRows[0].id;

    // map Stripe price ID to your package_id
    const priceId = session.display_items?.[0]?.plan?.id || session.line_items?.[0]?.price?.id;
    const planToPackageId = {
      "price_1RJGrtLKDEs1cWKCo8mMA1j7": 1, // basic
      "price_1RJGsSLKDEs1cWKC8K6ZmExk": 2, // premium
      "price_1RJGt7LKDEs1cWKCXILiIo2d": 3, // proplus
    };

    const package_id = planToPackageId[priceId];
    if (!package_id) return res.sendStatus(400);

    const start_date = new Date();
    const end_date = new Date();
    end_date.setMonth(end_date.getMonth() + 1); // 1 month from now
    
    try {
    await db.query(
      `INSERT INTO subscription (subscriber_id, package_id, start_date, end_date, status, payment_status)
       VALUES (?, ?, ?, ?, 'Active', 'Paid')`,
      [subscriber_id, package_id, start_date, end_date]
    );
    console.log("Subscription saved to DB for:", customerEmail);
  } catch (dbError) {
    console.error("DB insert failed:", dbError.message);
  }
  res.status(200).send("Webhook received");
}
}
