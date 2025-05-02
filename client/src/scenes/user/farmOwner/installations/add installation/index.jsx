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
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddInstallation = () => {
  const navigate = useNavigate();
  const [pond, setPond] = useState("");
  const [device, setDevice] = useState("");
  const [notes, setNotes] = useState("");
  const [ponds, setPonds] = useState([]);
  const [devices, setDevices] = useState([]);

  const fetchPondsAndDevices = async () => {
    const token = localStorage.getItem("token");

    try {
      const [pondRes, deviceRes] = await Promise.all([
        axios.get("http://localhost:5000/api/owner/get-ponds", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/owner/get-devices", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPonds(pondRes.data);
      setDevices(deviceRes.data);
    } catch (error) {
      console.error("Error fetching ponds/devices:", error.response?.data || error.message);
      alert("❌ Failed to load pond or device data.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please login.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/owner/create-installation",
        {
          pondId: pond,
          deviceId: device,
          installation_date: new Date().toISOString().split("T")[0],
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Installation created successfully!");
      navigate("/installations");
    } catch (error) {
      console.error("Error creating installation:", error.response?.data || error.message);
      alert("Failed to create installation.");
    }
  };

  useEffect(() => {
    fetchPondsAndDevices();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Add New Installation
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="pond-label">Select Pond</InputLabel>
          <Select
            labelId="pond-label"
            value={pond}
            onChange={(e) => setPond(e.target.value)}
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
          <InputLabel id="device-label">Select Device</InputLabel>
          <Select
            labelId="device-label"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            required
          >
            {devices.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Notes"
          multiline
          rows={4}
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" color="primary">
          Add Installation
        </Button>
      </form>
    </Box>
  );
};

export default AddInstallation;
