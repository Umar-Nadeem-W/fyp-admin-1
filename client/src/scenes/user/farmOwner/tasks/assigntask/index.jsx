import React, { useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const AssignTask = () => {
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedPond, setSelectedPond] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");

  const tasks = [
    { id: 1, name: "Feed Fish", category: "Routine", description: "Feed the fish in Pond 101" },
    { id: 2, name: "Clean Pond", category: "Maintenance", description: "Clean Pond 102" },
    { id: 3, name: "Fix Aerator", category: "Repair", description: "Fix the aerator in Pond 103" },
  ];

  const ponds = ["Pond 101", "Pond 102", "Pond 103"];
  const workers = ["Worker A", "Worker B", "Worker C"];

  const handleSubmit = () => {
    if (!selectedTask || !selectedPond || !selectedWorker) {
      alert("Please select a task, pond, and worker.");
      return;
    }
    alert(`Task assigned successfully!\nTask: ${selectedTask}\nPond: ${selectedPond}\nWorker: ${selectedWorker}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assign Task
      </Typography>

      {/* Task Table */}
      <Typography variant="h6" gutterBottom>
        Select a Task
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Task Category</TableCell>
              <TableCell>Task Description</TableCell>
              <TableCell>Select</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.category}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>
                  <Button
                    variant={selectedTask === task.name ? "contained" : "outlined"}
                    onClick={() => setSelectedTask(task.name)}
                  >
                    {selectedTask === task.name ? "Selected" : "Select"}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => alert(`Edit task: ${task.name}`)}>
                    <Edit />
                  </Button>
                  <Button onClick={() => alert(`Delete task: ${task.name}`)}>
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pond Selection */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Pond</InputLabel>
        <Select value={selectedPond} onChange={(e) => setSelectedPond(e.target.value)}>
          {ponds.map((pond, index) => (
            <MenuItem key={index} value={pond}>
              {pond}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Worker Selection */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Worker</InputLabel>
        <Select value={selectedWorker} onChange={(e) => setSelectedWorker(e.target.value)}>
          {workers.map((worker, index) => (
            <MenuItem key={index} value={worker}>
              {worker}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Submit Button */}
      <Button variant="contained" color="primary" onClick={handleSubmit} >
        Assign Task
      </Button>
    </Box>
  );
};

export default AssignTask;