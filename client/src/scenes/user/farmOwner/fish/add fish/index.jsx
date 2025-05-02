import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddFish = () => {
  const [ponds, setPonds] = useState([]);
  const [fishSpeciesList, setFishSpeciesList] = useState([]);
  const [pondId, setPondId] = useState("");
  const [fishId, setFishId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dateOfStocking, setDateOfStocking] = useState("");
  const [ageAtStocking, setAgeAtStocking] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const farmId = localStorage.getItem("farmId");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Unauthorized! Please login again.");
          navigate("/login");
          return;
        }
  
        // Fetch ponds
        const pondsResponse = await axios.get(
          `http://localhost:5000/api/owner/get-ponds-by-farm/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPonds(pondsResponse.data);
  
        // Fetch fish species
        const fishResponse = await axios.get(
          "http://localhost:5000/api/owner/get-all-fish",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFishSpeciesList(fishResponse.data);
      } catch (error) {
        console.error("Error fetching ponds or fish species:", error);
        alert("❌ Failed to load ponds or fish species.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [farmId, navigate]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/owner/add-fish-stock",
        {
          pondId,
          fish_id: fishId,
          quantity,
          date_of_stocking: dateOfStocking,
          age_at_stocking: ageAtStocking,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Fish Stock Added Successfully!");
      navigate("/fish"); // Redirect to fish list page
    } catch (error) {
      console.error("Error adding fish stock:", error);
      alert("❌ Failed to add fish stock.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Add Fish Stock
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="pond-label">Select Pond</InputLabel>
          <Select
            labelId="pond-label"
            value={pondId}
            onChange={(e) => setPondId(e.target.value)}
            required
          >
            {ponds.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="fish-species-label">Select Fish Species</InputLabel>
          <Select
            labelId="fish-species-label"
            value={fishId}
            onChange={(e) => setFishId(e.target.value)}
            required
          >
            {fishSpeciesList.map((fs) => (
              <MenuItem key={fs.id} value={fs.id}>
                {fs.species}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          label="Date of Stocking"
          type="date"
          fullWidth
          value={dateOfStocking}
          onChange={(e) => setDateOfStocking(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Age at Stocking (e.g., 2 months)"
          fullWidth
          value={ageAtStocking}
          onChange={(e) => setAgeAtStocking(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Fish Stock
        </Button>
      </form>
    </Box>
  );
};

export default AddFish;
