import React, { useState } from "react";
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

const AddInstallation = () => {
  const [pond, setPond] = useState("");
  const [device, setDevice] = useState("");
  const [notes, setNotes] = useState("");

  const ponds = [
    { id: "P456", name: "Pond A" },
    { id: "P123", name: "Pond B" },
    // Add more ponds as needed
  ];

  const devices = [
    { id: "D123", name: "Water Sensor" },
    { id: "D789", name: "Actuator X" },
    // Add more devices as needed
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Installation added:\nPond: ${pond}\nDevice: ${device}\nNotes: ${notes}`);
    // Add logic to handle form submission
  };

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
