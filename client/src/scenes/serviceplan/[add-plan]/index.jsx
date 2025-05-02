import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  description: "",
  price: "",
  duration: "",
  max_sites: "",
  max_ponds: "",
  max_workers: "",
};

const AddPlan = () => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/packages", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/list-plan");
    } catch (err) {
      console.error("Error adding plan:", err);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Add Package Plan
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              "name",
              "description",
              "price",
              "duration",
              "max_sites",
              "max_ponds",
              "max_workers",
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  label={field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  fullWidth
                  required={field !== "description"}
                  type={
                    ["price", "duration", "max_sites", "max_ponds", "max_workers"].includes(
                      field
                    )
                      ? "number"
                      : "text"
                  }
                />
              </Grid>
            ))}
          </Grid>
          <Box mt={3}>
            <Button type="submit" variant="contained" sx={{ mr: 2 }}>
              Create Plan
            </Button>
            <Button variant="outlined" onClick={() => setFormData(initialState)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddPlan;
