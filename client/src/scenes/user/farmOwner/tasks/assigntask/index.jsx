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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const AssignTask = () => {
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedPond, setSelectedPond] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [editTask, setEditTask] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [ponds, setPonds] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const token = localStorage.getItem("token");
  const farmId = localStorage.getItem("farmId");

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
          axios.get("http://localhost:5000/api/owner/get-all-task-categories", { headers }),
          axios.get(`http://localhost:5000/api/owner/get-ponds-by-farm/${farmId}`, { headers }),
          axios.get("http://localhost:5000/api/owner/get-workers", { headers }),
        ]);

        console.log("Task Categories Raw:", taskRes.data);
        console.log("Ponds:", pondRes.data);
        console.log("Workers:", workerRes.data);

        const extractedTasks = taskRes.data?.categories || [];
        setTasks(Array.isArray(extractedTasks) ? extractedTasks : []);

        setPonds(pondRes.data || []);
        const extractedWorkers = workerRes.data?.workers || workerRes.data || [];
        setWorkers(Array.isArray(extractedWorkers) ? extractedWorkers : []);
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

    const taskObj = tasks.find((t) => t.id === selectedTask);
    const isRoutine = taskObj?.task_category === "Routine";

    try {
      await axios.post(
        "http://localhost:5000/api/owner/create-task",
        {
          taskCategoryId: selectedTask,
          pond_id: selectedPond,
          assigned_to: selectedWorker,
          assigned_by: Number(farmId), // assuming this is who assigns
          description: "Auto-generated task", // optional
          due_date: isRoutine ? null : new Date().toISOString(), // 👈 REQUIRED for non-routine
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );      

      alert("✅ Task assigned successfully!");
      setSelectedTask("");
      setSelectedPond("");
      setSelectedWorker("");
    } catch (error) {
      console.error("Assignment error:", error.response?.data || error.message);
      alert("❌ Failed to assign task.");
    }
  };

  const handleEditOpen = (task) => {
    setEditTask({ ...task });
    setEditModalOpen(true);
  };

  const handleEditChange = (field, value) => {
    setEditTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/owner/update-task-category/${editTask.id}`,
        {
          task_category: editTask.task_category,
          task_type: editTask.task_type,
          task_type_description: editTask.task_type_description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Task category updated successfully!");
      setEditModalOpen(false);
      window.location.reload(); // Refresh the list
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      alert("❌ Failed to update task category.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task category?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/owner/delete-task-category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Task category deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      alert("❌ Failed to delete task category.");
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
              <TableCell>Task Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Select</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.task_type}</TableCell>
                  <TableCell>{task.task_category}</TableCell>
                  <TableCell>{task.task_type_description}</TableCell>
                  <TableCell>
                    <Button
                      variant={selectedTask === String(task.id) ? "contained" : "outlined"}
                      onClick={() => setSelectedTask(String(task.id))}
                    >
                      {selectedTask === String(task.id) ? "Selected" : "Select"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditOpen(task)}>
                      <Edit />
                    </Button>
                    <Button onClick={() => handleDelete(task.id)}>
                      <Delete />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No tasks available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="pond-label">Pond</InputLabel>
        <Select
          labelId="pond-label"
          value={selectedPond}
          onChange={(e) => setSelectedPond(e.target.value)}
        >
          {ponds.map((pond, index) => (
            <MenuItem key={pond.id ?? `pond-${index}`} value={String(pond.id)}>
              {pond.name || `Pond ${pond.id ?? index}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 3 }}>
  <InputLabel id="worker-label">Worker</InputLabel>
  <Select
    labelId="worker-label"
    value={selectedWorker ?? ""}
    onChange={(e) => {
      console.log("Selected Worker ID (raw):", e.target.value);
      const id = Number(e.target.value);
      console.log("Converted to number:", id);
      setSelectedWorker(id);
    }}
    label="Worker"
  >
    {workers.map((worker, index) => {
      const id = worker.id ?? index; // fallback if ID is missing
      return (
        <MenuItem key={id} value={id}>
          {worker.user_name || `Worker ${id}`}
        </MenuItem>
      );
    })}
  </Select>
</FormControl>


      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Assign Task
      </Button>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Task Category</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Task Type"
            value={editTask?.task_type || ""}
            onChange={(e) => handleEditChange("task_type", e.target.value)}
          />
          <TextField
            label="Task Category"
            value={editTask?.task_category || ""}
            onChange={(e) => handleEditChange("task_category", e.target.value)}
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            value={editTask?.task_type_description || ""}
            onChange={(e) => handleEditChange("task_type_description", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleEditSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssignTask;
