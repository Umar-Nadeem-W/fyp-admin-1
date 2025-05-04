import Stripe from "stripe";
import dotenv from "dotenv";
import db from "../../config/dbconfig.js"; // Import the database connection

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body; // this is the Stripe price_id
    const userEmail = req.user?.email || "qwe@gmail.com";
    
    if (!plan) {
      return res.status(400).json({ error: "Missing plan (price_id)" });
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: plan,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: "http://10.120.172.207:5000/api/stripe/payment-success/{CHECKOUT_SESSION_ID}?token=${token}",
      cancel_url: "http://10.120.172.207:5000/subcriptionpage?payment=cancel",
    });
    
    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    return res.status(500).json({ error: "Failed to create checkout session." });
  }
};

export const handlePaymentSuccess = async (req, res) => {
  try {
    const sessionId = req.params.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const customerEmail = session.customer_email;

      if (!customerEmail) {
        console.error("❌ No customer email found in session.");
        return res.redirect("http://localhost:3000/subcriptionpage?error=email_missing");
      }

      // 1. Get price_id from line items
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 1 });
      const priceId = lineItems?.data?.[0]?.price?.id;

      if (!priceId) {
        console.error("❌ No price ID found.");
        return res.redirect("http://localhost:3000/subcriptionpage?error=price_missing");
      }

      // 2. Lookup user ID
      const [userRows] = await db.query("SELECT id FROM user WHERE email = ?", [customerEmail]);
      if (!userRows.length) {
        console.error("❌ User not found.");
        return res.redirect("http://localhost:3000/subcriptionpage?error=user_not_found");
      }
      const userId = userRows[0].id;

      // 3. Lookup farm_owner (subscriber_id)
      const [ownerRows] = await db.query("SELECT id FROM farm_owner WHERE user_id = ?", [userId]);
      if (!ownerRows.length) {
        console.error("❌ Farm owner not found.");
        return res.redirect("http://localhost:3000/subcriptionpage?error=owner_not_found");
      }
      const subscriberId = ownerRows[0].id;

      // 4. Lookup package_id
      const [pkgRows] = await db.query("SELECT id FROM packages WHERE price_id = ?", [priceId]);
      if (!pkgRows.length) {
        console.error("❌ Package not found.");
        return res.redirect("http://localhost:3000/subcriptionpage?error=package_not_found");
      }
      const packageId = pkgRows[0].id;

      // 5. Insert subscription
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await db.query(
        `INSERT INTO subscription (subscriber_id, package_id, start_date, end_date, status, payment_status)
         VALUES (?, ?, ?, ?, 'Active', 'Paid')`,
        [subscriberId, packageId, startDate, endDate]
      );

      console.log("✅ Subscription recorded successfully.");
      return res.redirect("http://localhost:3000/subcriptionpage?payment=success");
    }

    res.redirect("http://localhost:3000/subcriptionpage?payment=failed");
  } catch (error) {
    console.error("💥 Error in handlePaymentSuccess:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
