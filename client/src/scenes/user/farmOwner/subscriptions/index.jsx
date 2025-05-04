"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import getStripe from "./get-stripe";

const stripePromise = getStripe();

const SubscriptionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [AWNInstance, setAWNInstance] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Load notification lib
  useEffect(() => {
    if (typeof window !== "undefined") {
      const options = { position: "top-right" };
      const AWN = require("awesome-notifications").default;
      setAWNInstance(new AWN(options));
    }
  }, []);

  // Handle payment status
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

  // Fetch subscriptions from backend
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/owner/packages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch packages");

        const data = await response.json();
        setSubscriptions(data.packages || []); // depends on your API structure
      } catch (error) {
        console.error(error);
        setFetchError("Unable to load subscription packages.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [navigate]);

  const handleSubscribe = async (plan) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        if (AWNInstance) AWNInstance.alert("Please log in first to subscribe.");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : fetchError ? (
        <Alert severity="error" sx={{ textAlign: "center" }}>
          {fetchError}
        </Alert>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {subscriptions.map((sub, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
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
                    ${sub.price}/month
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ textAlign: "center", fontSize: "14px" }}>
                      Sites: {sub.max_sites}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: "center", fontSize: "14px" }}>
                      Ponds: {sub.max_ponds}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: "center", fontSize: "14px" }}>
                      Workers: {sub.max_workers}
                    </Typography>
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
                    onClick={() => handleSubscribe(sub.price_id)}
                  >
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SubscriptionsPage;
