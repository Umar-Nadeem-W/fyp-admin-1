import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDevice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "Sensor",
    manufacturer: "",
    model: "",
    read_key: "",
    write_key: "",
    serial_number: "",
    status: "Active",
    sensors: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        sensors: checked
          ? [...prev.sensors, value]
          : prev.sensors.filter((sensor) => sensor !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please login.");
      return;
    }

    const sensorObjects = formData.sensors.map((type) => {
      return { sensor_type: type, unit: type === "pH" ? "pH" : type === "Temperature" ? "Celsius" : "NTU" };
    });

    try {
      await axios.post(
        "http://localhost:5000/api/owner/add-device",
        {
          ...formData,
          sensors: sensorObjects,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Device added successfully!");
      navigate("/viewdevice"); // redirect to list if you have this route
    } catch (error) {
      console.error("Error adding device:", error.response?.data || error.message);
      alert("Failed to add device.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Add Device
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Device Name" name="name" value={formData.name} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth select label="Type" name="type" value={formData.type} onChange={handleChange} required>
              <MenuItem value="Sensor">Sensor</MenuItem>
              <MenuItem value="Actuator">Actuator</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Model" name="model" value={formData.model} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type="password" label="Read Key" name="read_key" value={formData.read_key} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type="password" label="Write Key" name="write_key" value={formData.write_key} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Serial Number" name="serial_number" value={formData.serial_number} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth select label="Status" name="status" value={formData.status} onChange={handleChange} required>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Sensors:
            </Typography>
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox name="sensors" value="pH" checked={formData.sensors.includes("pH")} onChange={handleChange} />}
                label="pH"
              />
              <FormControlLabel
                control={<Checkbox name="sensors" value="Temperature" checked={formData.sensors.includes("Temperature")} onChange={handleChange} />}
                label="Temperature"
              />
              <FormControlLabel
                control={<Checkbox name="sensors" value="Turbidity" checked={formData.sensors.includes("Turbidity")} onChange={handleChange} />}
                label="Turbidity"
              />
              <FormControlLabel
                control={<Checkbox name="sensors" value="N/A" checked={formData.sensors.includes("N/A")} onChange={handleChange} />}
                label="N/A"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddDevice;
