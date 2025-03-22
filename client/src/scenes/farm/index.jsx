import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialFarmState = {
  name: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zip: "",
  number_of_ponds: "",
  number_of_workers: "",
};

const FarmManagement = () => {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [farmData, setFarmData] = useState(initialFarmState);
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/farms");
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  };

  const handleFarmSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedFarm) {
        await axios.put(
          `http://localhost:5000/api/farms/${selectedFarm}`,
          farmData
        );
      } else {
        await axios.post("http://localhost:5000/api/farms", farmData);
      }
      fetchFarms();
      resetForm();
    } catch (error) {
      console.error("Error saving farm:", error);
    }
  };

  const resetForm = () => {
    setShowFarmForm(false);
    setSelectedFarm(null);
    setFarmData(initialFarmState);
  };

  const handleDeleteFarm = async (farmId) => {
    try {
      await axios.delete(`http://localhost:5000/api/farms/${farmId}`);
      fetchFarms();
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmData({ ...farmData, [name]: value });
  };

  return (
    <Box p={isSmallScreen ? 2 : 4}>
      <Typography variant="h4" gutterBottom>
        Farm Management
      </Typography>

      <Button
        variant="contained"
        onClick={() => {
          setShowFarmForm(true);
          setSelectedFarm(null);
          setFarmData(initialFarmState);
        }}
        sx={{ mb: 3 }}
      >
        Add Farm
      </Button>

      {showFarmForm && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {selectedFarm ? "Edit Farm" : "Add New Farm"}
          </Typography>
          <Box component="form" onSubmit={handleFarmSubmit}>
            <Grid container spacing={2}>
              {[
                { label: "Farm Name", name: "name" },
                { label: "Address", name: "address" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Country", name: "country" },
                { label: "Zip", name: "zip" },
                { label: "Number Of Ponds", name: "number_of_ponds", type: "number" },
                { label: "Number Of Workers", name: "number_of_workers", type: "number" },
              ].map(({ label, name, type = "text" }) => (
                <Grid item xs={12} sm={6} key={name}>
                  <TextField
                    fullWidth
                    label={label}
                    name={name}
                    value={farmData[name]}
                    onChange={handleChange}
                    required
                    type={type}
                  />
                </Grid>
              ))}
            </Grid>

            <Box mt={3}>
              <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                {selectedFarm ? "Update" : "Create"}
              </Button>
              <Button onClick={resetForm} variant="outlined" color="secondary">
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Typography variant="h5" gutterBottom>
        All Farms
      </Typography>

      {farms.length ? (
        <Grid container spacing={2}>
          {farms.map((farm) => (
            <Grid item xs={12} sm={6} md={4} key={farm.id}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6">{farm.name}</Typography>
                <Typography variant="body2">
                  {farm.city}, {farm.state}
                </Typography>
                <Typography variant="body2">
                  Ponds: {farm.number_of_ponds}, Workers: {farm.number_of_workers}
                </Typography>

                <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setSelectedFarm(farm.id);
                      setFarmData(farm);
                      setShowFarmForm(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteFarm(farm.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/farm/farmdetails/${farm.id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography mt={2}>No farms available.</Typography>
      )}
    </Box>
  );
};

export default FarmManagement;
