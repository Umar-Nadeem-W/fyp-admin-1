import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const AssignTask = () => {
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedPond, setSelectedPond] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");

  const [tasks, setTasks] = useState([]);
  const [ponds, setPonds] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const farmId = localStorage.getItem("farmId"); // assuming you store farmId after login or selection

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !farmId) {
        alert("User not authenticated or farm not selected.");
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [taskRes, pondRes, workerRes] = await Promise.all([
          axios.get("http://localhost:5000/api/owner/get-all-tasks", { headers }),
          axios.get(`http://localhost:5000/api/owner/get-ponds/${farmId}`, { headers }),
          axios.get("http://localhost:5000/api/owner/get-workers", { headers }),
        ]);

        setTasks(Array.isArray(taskRes.data) ? taskRes.data : taskRes.data.tasks || []);
        setPonds(pondRes.data || []);
        setWorkers(workerRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        alert("❌ Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, farmId]);

  const handleSubmit = async () => {
    if (!selectedTask || !selectedPond || !selectedWorker) {
      alert("Please select a task, pond, and worker.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/owner/assign-task",
        {
          task_id: selectedTask,
          pond_id: selectedPond,
          worker_id: selectedWorker,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Task assigned successfully!");
    } catch (error) {
      console.error("Assignment error:", error.response?.data || error.message);
      alert("❌ Failed to assign task.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assign Task
      </Typography>

      <Typography variant="h6" gutterBottom>
        Select a Task
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Select</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.task_type}</TableCell>
                <TableCell>{task.task_category}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>
                  <Button
                    variant={selectedTask === task.id ? "contained" : "outlined"}
                    onClick={() => setSelectedTask(task.id)}
                  >
                    {selectedTask === task.id ? "Selected" : "Select"}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => alert(`Edit task: ${task.id}`)}>
                    <Edit />
                  </Button>
                  <Button onClick={() => alert(`Delete task: ${task.id}`)}>
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Pond</InputLabel>
        <Select value={selectedPond} onChange={(e) => setSelectedPond(e.target.value)}>
          {ponds.map((pond) => (
            <MenuItem key={pond.id} value={pond.id}>
              {pond.name || `Pond ${pond.id}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Worker</InputLabel>
        <Select value={selectedWorker} onChange={(e) => setSelectedWorker(e.target.value)}>
          {workers.map((worker) => (
            <MenuItem key={worker.id} value={worker.id}>
              {worker.name || `Worker ${worker.id}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Assign Task
      </Button>
    </Box>
  );
};

export default AssignTask;
