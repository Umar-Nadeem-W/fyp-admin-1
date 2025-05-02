"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Card, CardContent, Typography, Grid, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import getStripe from "./get-stripe";

const stripePromise = getStripe();

const SubscriptionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [AWNInstance, setAWNInstance] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // <-- NEW

  useEffect(() => {
    if (typeof window !== "undefined") {
      const options = { position: "top-right" };
      const AWN = require("awesome-notifications").default;
      setAWNInstance(new AWN(options));
    }
  }, []);

  // Check if payment success or cancel from query param
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const payment = query.get("payment");
    if (payment === "success") {
      setPaymentStatus("success");
      if (AWNInstance) AWNInstance.success("Payment Successful! 🎉");
    } else if (payment === "cancel") {
      setPaymentStatus("cancel");
      if (AWNInstance) AWNInstance.alert("Payment cancelled.");
    }
  }, [location.search, AWNInstance]);

  const handleSubscribe = async (plan) => {
    try {
      if (!localStorage.getItem('token')) {
        if (AWNInstance) AWNInstance.alert("Please log in first to subscribe.");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // <-- ADD TOKEN
        },
        body: JSON.stringify({ plan }),
      });
      

      if (!response.ok) throw new Error("Failed to create checkout session");

      const result = await response.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: result.sessionId });
    } catch (error) {
      console.error("Checkout error:", error);
      if (AWNInstance) AWNInstance.alert("Failed to initiate checkout.");
    }
  };

  const subscriptions = [
    {
      name: "Basic Plan",
      plan: "basic",
      price: "$10/month",
      description: "Perfect for small farms.",
      features: ["1 Site", "2 Ponds", "5 Workers"],
      gradient: "linear-gradient(135deg, #6a11cb, #2575fc)",
    },
    {
      name: "Premium Plan",
      plan: "premium",
      price: "$20/month",
      description: "Best for growing farms.",
      features: ["3 Sites", "5 Ponds", "10 Workers"],
      gradient: "linear-gradient(135deg, #ff7e5f, #feb47b)",
    },
    {
      name: "Pro Plus Plan",
      plan: "proplus",
      price: "$50/month",
      description: "Ideal for large farms.",
      features: ["5 Sites", "10 Ponds", "20 Workers"],
      gradient: "linear-gradient(135deg, #43cea2, #185a9d)",
    },
  ];

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f4f4f9", minHeight: "100vh" }}>
      <Typography
        variant="h3"
        sx={{
          mb: 4,
          textAlign: "center",
          fontWeight: "bold",
          color: "#333",
          textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        Choose Your Subscription
      </Typography>

      {paymentStatus === "success" && (
        <Alert severity="success" sx={{ mb: 3, textAlign: "center" }}>
          🎉 Payment Successful! Thank you for subscribing.
        </Alert>
      )}
      {paymentStatus === "cancel" && (
        <Alert severity="warning" sx={{ mb: 3, textAlign: "center" }}>
          ⚠️ Payment was cancelled. Please try again.
        </Alert>
      )}

      <Grid container spacing={4} justifyContent="center">
        {subscriptions.map((sub, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                background: sub.gradient,
                color: "#fff",
                borderRadius: "15px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
                  {sub.name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, textAlign: "center", fontStyle: "italic" }}>
                  {sub.description}
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                  {sub.price}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {sub.features.map((feature, idx) => (
                    <Typography
                      key={idx}
                      variant="body2"
                      sx={{ textAlign: "center", fontSize: "14px" }}
                    >
                      - {feature}
                    </Typography>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: "#fff",
                    color: "#000",
                    fontWeight: "bold",
                    borderRadius: "25px",
                    "&:hover": { backgroundColor: "#eee" },
                  }}
                  onClick={() => handleSubscribe(sub.plan)}
                >
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SubscriptionsPage;