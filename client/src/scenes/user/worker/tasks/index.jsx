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
  Menu,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const Tasks = () => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [anchorEl, setAnchorEl] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token"); // assuming token is stored in localStorage
      const res = await axios.get("/api/worker/worker", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks =
    filterStatus === "All"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (status) => {
    if (status) setFilterStatus(status);
    setAnchorEl(null);
  };

  const markAsCompleted = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/api/worker/mark-completed/${taskId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: "Completed" } : task
        )
      );
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" color="primary" onClick={handleFilterClick}>
          Filter: {filterStatus}
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleFilterClose(null)}>
          <MenuItem onClick={() => handleFilterClose("All")}>All</MenuItem>
          <MenuItem onClick={() => handleFilterClose("Pending")}>Pending</MenuItem>
          <MenuItem onClick={() => handleFilterClose("Completed")}>Completed</MenuItem>
        </Menu>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task ID</TableCell>
              <TableCell>Pond</TableCell>
              <TableCell>Task Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.pond_name}</TableCell>
                <TableCell>{task.task_type}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{new Date(task.due_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {task.status === "Pending" && (
                    <Button variant="contained" color="primary" onClick={() => markAsCompleted(task.id)}>
                      Mark as Completed
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Tasks;
