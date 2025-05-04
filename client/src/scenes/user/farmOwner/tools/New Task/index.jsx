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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewTask = () => {
  const [task_category, setTask_Category] = useState("");
  const [taskType, setTaskType] = useState("");
  const [task_type_description, setTask_Type_Description] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("User not authenticated. Please log in again.");
      return;
    }
  
    try {
      await axios.post(
        "http://localhost:5000/api/owner/create-task-category",    
        {
          task_category,
          task_type: taskType,
          task_type_description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      alert("✅ Task Created Successfully!");
      navigate("/newtask");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("❌ Failed to create task. Please try again.");
    }
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
            value={task_category}
            onChange={(e) => setTask_Category(e.target.value)}
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
          value={task_type_description}
          onChange={(e) => setTask_Type_Description(e.target.value)}
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
