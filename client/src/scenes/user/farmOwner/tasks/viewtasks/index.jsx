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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("User not authenticated. Please log in again.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/owner/get-all-task-categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Tasks API response:", response.data);

        // Support flexible response structure
        const responseData = response.data;
        if (Array.isArray(responseData)) {
          setTasks(responseData);
        } else if (responseData && Array.isArray(responseData.tasks)) {
          setTasks(responseData.tasks);
        } else {
          console.error("Unexpected response structure", responseData);
          setTasks([]); // fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching tasks:", error.response?.data || error.message);
        alert("❌ Failed to fetch tasks");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

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
            Create New Task
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
                      <Button onClick={() => alert(`Edit task: ${task.id}`)}>
                        <Edit />
                      </Button>
                      <Button onClick={() => alert(`Delete task: ${task.id}`)}>
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
    </Box>
  );
};

export default Tasks;
