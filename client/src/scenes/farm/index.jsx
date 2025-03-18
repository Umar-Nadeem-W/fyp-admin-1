import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FarmManagement = () => {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [farmData, setFarmData] = useState({ name: "", address: "", city: "", state: "", country: "", zip: "", number_of_ponds: "", number_of_workers: "" });
  const navigate = useNavigate();

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
        await axios.put(`http://localhost:5000/api/farms/${selectedFarm}`, farmData);
      } else {
        await axios.post("http://localhost:5000/api/farms", farmData);
      }
      fetchFarms();
      setShowFarmForm(false);
      setSelectedFarm(null);
      setFarmData({ name: "", address: "", city: "", state: "", country: "", zip: "", number_of_ponds: "", number_of_workers: "" });
    } catch (error) {
      console.error("Error saving farm:", error);
    }
  };

  const handleDeleteFarm = async (farmId) => {
    try {
      await axios.delete(`http://localhost:5000/api/farms/${farmId}`);
      fetchFarms();
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  };

  return (
    <Box m="1.5rem">
      <Typography variant="h4">Farm Management</Typography>

      <Button variant="contained" onClick={() => { setShowFarmForm(true); setSelectedFarm(null); }} sx={{ mt: 2 }}>
        Add Farm
      </Button>

      {showFarmForm && (
        <Box component="form" mt={2} p={2} onSubmit={handleFarmSubmit} sx={{ border: "1px solid gray", borderRadius: "8px" }}>
          <TextField fullWidth label="Farm Name" value={farmData.name} onChange={(e) => setFarmData({ ...farmData, name: e.target.value })} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Address" value={farmData.address} onChange={(e) => setFarmData({ ...farmData, address: e.target.value })} required sx={{ mb: 2 }} />
          <TextField fullWidth label="City" value={farmData.city} onChange={(e) => setFarmData({ ...farmData, city: e.target.value })} required sx={{ mb: 2 }} />
          <TextField fullWidth label="State" value={farmData.state} onChange={(e) => setFarmData({ ...farmData, state: e.target.value })} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Country" value={farmData.country} onChange={(e) => setFarmData({ ...farmData, country: e.target.value })} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Zip" value={farmData.zip} onChange={(e) => setFarmData({ ...farmData, zip: e.target.value })} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Number Of Ponds" type="number" value={farmData.number_of_ponds} onChange={(e) => setFarmData({ ...farmData, number_of_ponds: e.target.value })} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Number Of Workers" type="number" value={farmData.number_of_workers} onChange={(e) => setFarmData({ ...farmData, number_of_workers: e.target.value })} required sx={{ mb: 2 }} />
          <Button variant="contained" type="submit">{selectedFarm ? "Update Farm" : "Add Farm"}</Button>
        </Box>
      )}

      <Typography variant="h5" mt={3}>Farms</Typography>
      {farms.length > 0 ? (
        farms.map(farm => (
          <Box key={farm.id} p={2} mt={2} sx={{ border: "1px solid gray", borderRadius: "8px", cursor: "pointer" }}>
            <Typography variant="h6">{farm.name}</Typography>
            <Typography variant="body2">Location: {farm.city}, {farm.state}</Typography>
            <Typography variant="body2">Ponds: {farm.number_of_ponds}</Typography>
            <Button variant="outlined" onClick={() => { setSelectedFarm(farm.id); setFarmData(farm); setShowFarmForm(true); }} sx={{ mt: 1, mr: 1 }}>Edit</Button>
            <Button variant="outlined" color="error" onClick={() => handleDeleteFarm(farm.id)} sx={{ mt: 1 }}>Delete</Button>
            <Button variant="outlined" color="primary" onClick={() => navigate(`/farm/farmdetails/${farm.id}`)} sx={{ mt: 1 }}>
              View Details
            </Button>
          </Box>
        ))
      ) : (
        <Typography variant="body1" mt={2}>No farms available</Typography>
      )}
    </Box>
  );
};

export default FarmManagement;
