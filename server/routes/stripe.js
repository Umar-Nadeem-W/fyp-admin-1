import express from 'express';
import { createCheckoutSession } from '../controllers/owner/stripeController.js';
import { verifyToken } from "../middlewares/auth.js";
// import  {checkAuthStripe}  from "../middlewares/check-auth-stripe.js";
import { handlePaymentSuccess } from "../controllers/owner/stripeController.js";

const router = express.Router();

// POST /api/stripe/checkout (token protected)
router.post("/checkout", verifyToken, createCheckoutSession);

router.get('/payment-success/:session_id',  handlePaymentSuccess);
// router.get('/checkout-session/:session_id',getSession);



export default router;
