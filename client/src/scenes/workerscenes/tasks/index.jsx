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
  Menu,
  MenuItem,
} from "@mui/material";

const Tasks = () => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [anchorEl, setAnchorEl] = useState(null);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      pond_id: 101,
      name: "Feed Fish",
      type: "Feeding",
      description: "Feed the fish in Pond A",
      status: "Pending",
      due_date: "2023-10-01",
    },
    {
      id: 2,
      pond_id: 102,
      name: "Clean Pond",
      type: "Maintenance",
      description: "Clean Pond B thoroughly",
      status: "Completed",
      due_date: "2023-09-25",
    },
    {
      id: 3,
      pond_id: 103,
      name: "Check Water Quality",
      type: "Monitoring",
      description: "Test pH and turbidity levels in Pond C",
      status: "Pending",
      due_date: "2023-10-05",
    },
  ]);

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

  const markAsCompleted = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: "Completed" } : task
      )
    );
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilterClick}
        >
          Filter: {filterStatus}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleFilterClose(null)}
        >
          <MenuItem onClick={() => handleFilterClose("All")}>All</MenuItem>
          <MenuItem onClick={() => handleFilterClose("Pending")}>
            Pending
          </MenuItem>
          <MenuItem onClick={() => handleFilterClose("Completed")}>
            Completed
          </MenuItem>
        </Menu>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task ID</TableCell>
              <TableCell>Pond ID</TableCell>
              <TableCell>Task Name</TableCell>
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
                <TableCell>{task.pond_id}</TableCell>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.due_date}</TableCell>
                <TableCell>
                  {task.status === "Pending" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => markAsCompleted(task.id)}
                    >
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