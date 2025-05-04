import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import axios from "axios";

const AddFarm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    number_of_ponds: "",
    number_of_workers: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      owner_id: 1, // Hardcoded owner_id
      ...formData,
    };
    console.log("Data to send:", dataToSend);

    try {
      const response = await axios.post("http://localhost:5000/api/farms", dataToSend);
      console.log("Farm added successfully:", response.data);
      alert("Farm added successfully!");
    } catch (error) {
      console.error("Error adding farm:", error);
      alert("Failed to add farm. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Add Farm
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Farm Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="ZIP Code"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Number of Ponds"
              name="number_of_ponds"
              value={formData.number_of_ponds}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Number of Workers"
              name="number_of_workers"
              value={formData.number_of_workers}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddFarm;