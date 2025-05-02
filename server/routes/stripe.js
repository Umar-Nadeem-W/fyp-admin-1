import express from 'express';
import { createCheckoutSession, handleStripeWebhook } from '../controllers/owner/stripeController.js';

const router = express.Router();

// Checkout route
router.post("/checkout", createCheckoutSession);

// Webhook route
router.post("/webhook", handleStripeWebhook);


export default router;
