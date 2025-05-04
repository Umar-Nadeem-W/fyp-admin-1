import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    if (!token) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/owner/get-all-tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data;
      if (Array.isArray(responseData)) {
        setTasks(responseData);
      } else if (responseData && Array.isArray(responseData.tasks)) {
        setTasks(responseData.tasks);
      } else {
        console.error("Unexpected response structure", responseData);
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
      alert("❌ Failed to fetch tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/owner/delete-task/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Task deleted successfully");
      fetchTasks(); // refresh list
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error.message);
      alert("❌ Failed to delete task");
    }
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask({ ...task }); // create a copy
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedTask(null);
    setEditModalOpen(false);
  };

  const handleEditChange = (field, value) => {
    setSelectedTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/owner/update-task/${selectedTask.id}`,
        selectedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Task updated successfully");
      handleCloseEditModal();
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error.message);
      alert("❌ Failed to update task");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Tasks</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={() => navigate("/tasks/assign-task")}
          >
            Assign Task
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/tools/new-task")}
          >
            Create New Task Category
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Pond ID</TableCell>
                <TableCell>Task Category</TableCell>
                <TableCell>Task Type</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Assigned By</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.pond_id || "—"}</TableCell>
                    <TableCell>{task.task_category}</TableCell>
                    <TableCell>{task.task_type}</TableCell>
                    <TableCell>{task.assigned_to || "—"}</TableCell>
                    <TableCell>{task.assigned_by || "—"}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{task.due_date}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpenEditModal(task)}>
                        <Edit />
                      </Button>
                      <Button onClick={() => handleDeleteTask(task.id)}>
                        <Delete />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No tasks available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Description"
            value={selectedTask?.description || ""}
            onChange={(e) => handleEditChange("description", e.target.value)}
            fullWidth
          />
          <TextField
            label="Status"
            value={selectedTask?.status || ""}
            onChange={(e) => handleEditChange("status", e.target.value)}
            fullWidth
          />
          <TextField
            type="date"
            label="Due Date"
            InputLabelProps={{ shrink: true }}
            value={selectedTask?.due_date || ""}
            onChange={(e) => handleEditChange("due_date", e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button onClick={handleSubmitEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;
