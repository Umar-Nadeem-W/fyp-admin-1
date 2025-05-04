import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const Tasks = () => {
  const navigate = useNavigate();
  const tasks = [
    {
      id: 1,
      pond_id: 101,
      task_category: "Routine",
      task_type: "Feeding",
      assigned_to: "Worker A",
      assigned_by: "Manager X",
      description: "Feed the fish in Pond 101",
      status: "Pending",
      due_date: "2023-12-01",
    },
    {
      id: 2,
      pond_id: 102,
      task_category: "Routine",
      task_type: "Cleaning",
      assigned_to: "Worker B",
      assigned_by: "Manager Y",
      description: "Clean Pond 102",
      status: "In Progress",
      due_date: "2023-12-02",
    },
    {
      id: 3,
      pond_id: 103,
      task_category: "Owner-Assigned",
      task_type: "Maintenance",
      assigned_to: "Worker C",
      assigned_by: "Manager Z",
      description: "Fix the aerator in Pond 103",
      status: "Completed",
      due_date: "2023-12-03",
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Tasks</Typography>
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() =>{navigate('/tasks/assign-task')}}>
            Assign Task
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate("/tools/new-task")}>
            Create New Task
          </Button>
        </Box>
      </Box>
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
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.pond_id}</TableCell>
                <TableCell>{task.task_category}</TableCell>
                <TableCell>{task.task_type}</TableCell>
                <TableCell>{task.assigned_to}</TableCell>
                <TableCell>{task.assigned_by}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Tasks;