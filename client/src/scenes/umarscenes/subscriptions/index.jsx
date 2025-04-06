import React from "react";
import { Box, Button, Card, CardContent, Typography, Grid } from "@mui/material";

const SubscriptionsPage = () => {
  const handleButtonClick = (message) => {
    alert(message);
  };

  const subscriptions = [
    {
      name: "Basic Plan",
      description: "Starter package for small farms",
      price: "$10/month",
      duration: "1 month",
      renewal_date: "2023-12-01",
      max_sites: 1,
      max_ponds: 2,
      max_workers: 5,
      buttonText: "Renew",
      buttonColor: "primary",
      buttonAction: () => handleButtonClick("Renew Basic Plan"),
      gradient: "linear-gradient(135deg, #6a11cb, #2575fc)",
    },
    {
      name: "Plus Plan",
      description: "Advanced package for medium farms",
      price: "$20/month",
      duration: "1 month",
      renewal_date: "N/A",
      max_sites: 3,
      max_ponds: 5,
      max_workers: 10,
      buttonText: "Upgrade to Plus!",
      buttonColor: "success",
      buttonAction: () => handleButtonClick("Upgrade to Plus Plan"),
      gradient: "linear-gradient(135deg, #ff7e5f, #feb47b)",
    },
    {
      name: "Premium Plan",
      description: "Comprehensive package for large farms",
      price: "$30/month",
      duration: "1 month",
      renewal_date: "N/A",
      max_sites: 5,
      max_ponds: 10,
      max_workers: 20,
      buttonText: "Upgrade to Premium!",
      buttonColor: "success",
      buttonAction: () => handleButtonClick("Upgrade to Premium Plan"),
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
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        Current Subscription
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {subscriptions.map((sub, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                background: sub.gradient,
                color: "#fff",
                borderRadius: "15px",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                transform: "scale(1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {sub.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    textAlign: "center",
                    fontStyle: "italic",
                  }}
                >
                  {sub.description}
                </Typography>
                <Typography variant="h6" sx={{ mb: 1, textAlign: "center" }}>
                  <strong>Price:</strong> {sub.price}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, textAlign: "center" }}>
                  <strong>Duration:</strong> {sub.duration}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, textAlign: "center" }}>
                  <strong>Renewal Date:</strong> {sub.renewal_date}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, textAlign: "center" }}>
                  <strong>Max Sites:</strong> {sub.max_sites}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, textAlign: "center" }}>
                  <strong>Max Ponds:</strong> {sub.max_ponds}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, textAlign: "center" }}>
                  <strong>Max Workers:</strong> {sub.max_workers}
                </Typography>
                <Button
                  variant="contained"
                  color={sub.buttonColor}
                  fullWidth
                  sx={{
                    fontWeight: "bold",
                    borderRadius: "25px",
                    boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
                  }}
                  onClick={sub.buttonAction}
                >
                  {sub.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Button
          variant="contained"
          color="error"
          sx={{
            fontWeight: "bold",
            borderRadius: "25px",
            padding: "10px 20px",
            boxShadow: "0 5px 10px rgba(255, 0, 0, 0.3)",
          }}
          onClick={() => handleButtonClick("Cancel Subscription")}
        >
          Cancel Subscription
        </Button>
      </Box>
    </Box>
  );
};

export default SubscriptionsPage;
