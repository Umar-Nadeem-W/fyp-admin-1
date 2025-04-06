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

const NewTask = () => {
  const [category, setCategory] = useState("");
  const [taskType, setTaskType] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Task Created:\nCategory: ${category}\nType: ${taskType}\nDescription: ${description}`);
    // Add logic to handle form submission
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Create New Task
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="category-label">Task Category</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <MenuItem value="routine">Routine</MenuItem>
            <MenuItem value="owner-assigned">Owner-Assigned</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Task Type"
          fullWidth
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          label="Task Description"
          multiline
          rows={4}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Create Task
        </Button>
      </form>
    </Box>
  );
};

export default NewTask;