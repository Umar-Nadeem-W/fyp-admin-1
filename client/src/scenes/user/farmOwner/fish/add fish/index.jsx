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

const AddFish = () => {
  const [pond, setPond] = useState("");
  const [fishSpecies, setFishSpecies] = useState("");
  const [ageAtStocking, setAgeAtStocking] = useState("");

  const ponds = [
    { id: "Pond A", name: "Pond A" },
    { id: "Pond B", name: "Pond B" },
    // Add more ponds as needed
  ];

  const fishSpeciesList = [
    { id: "Tilapia", name: "Tilapia" },
    { id: "Catfish", name: "Catfish" },
    // Add more fish species as needed
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Fish Stock Added:\nPond: ${pond}\nFish Species: ${fishSpecies}\nAge at Stocking: ${ageAtStocking}`);
    // Add logic to handle form submission
  };

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
          <InputLabel id="fish-species-label">Select Fish Species</InputLabel>
          <Select
            labelId="fish-species-label"
            value={fishSpecies}
            onChange={(e) => setFishSpecies(e.target.value)}
            required
          >
            {fishSpeciesList.map((fs) => (
              <MenuItem key={fs.id} value={fs.id}>
                {fs.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Age at Stocking (e.g., 2 months)"
          fullWidth
          value={ageAtStocking}
          onChange={(e) => setAgeAtStocking(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Add Fish Stock
        </Button>
      </form>
    </Box>
  );
};

export default AddFish;
