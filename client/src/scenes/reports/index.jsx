import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Card, CardContent } from "@mui/material";
import { Header } from "components";
import { format } from "date-fns";

const ponds = [
  { id: 1, name: "Pond A" },
  { id: 2, name: "Pond B" },
];

const workerName = "John Doe"; // Ideally, fetch from auth context or backend

const Reports = () => {
  const [selectedPond, setSelectedPond] = useState(ponds[0].id);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("yellow");
  const [timestamp, setTimestamp] = useState(format(new Date(), "yyyy-MM-dd HH:mm:ss"));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    const report = {
      pondId: selectedPond,
      description,
      category,
      workerName,
      timestamp,
    };
    console.log("Report Submitted:", report);
    // Integrate with backend API here
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Report Issues" />

      <FormControl fullWidth margin="normal">
        <InputLabel>Pond</InputLabel>
        <Select value={selectedPond} onChange={(e) => setSelectedPond(e.target.value)}>
          {ponds.map((pond) => (
            <MenuItem key={pond.id} value={pond.id}>{pond.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Describe the Issue"
        multiline
        rows={4}
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <MenuItem value="red">Red - Immediate Attention</MenuItem>
          <MenuItem value="orange">Orange - Moderately Urgent</MenuItem>
          <MenuItem value="yellow">Yellow - Not Urgent</MenuItem>
        </Select>
      </FormControl>

      <Card variant="outlined" sx={{ my: 2 }}>
        <CardContent>
          <Typography variant="body1"><strong>Worker Name:</strong> {workerName}</Typography>
          <Typography variant="body1"><strong>Timestamp:</strong> {timestamp}</Typography>
        </CardContent>
      </Card>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit Report
      </Button>
    </Box>
  );
};

export default Reports;
