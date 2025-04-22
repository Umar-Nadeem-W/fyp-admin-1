import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const AddPond = () => {
  const [formData, setFormData] = useState({
    farm_id: "",
    name: "",
    type: "",
    length: "",
    width: "",
    depth: "",
  });

  const farms = [
    { id: 1, name: "Farm A" },
    { id: 2, name: "Farm B" },
    { id: 3, name: "Farm C" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Pond data submitted:", formData);
    alert("Pond added successfully!");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Add Pond
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Farm Name</InputLabel>
              <Select
                name="farm_id"
                value={formData.farm_id}
                onChange={handleChange}
              >
                {farms.map((farm) => (
                  <MenuItem key={farm.id} value={farm.id}>
                    {farm.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pond Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <MenuItem value="Clay">Clay</MenuItem>
                <MenuItem value="Concrete">Concrete</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="number"
              label="Length"
              name="length"
              value={formData.length}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="number"
              label="Width"
              name="width"
              value={formData.width}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="number"
              label="Depth"
              name="depth"
              value={formData.depth}
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

export default AddPond;