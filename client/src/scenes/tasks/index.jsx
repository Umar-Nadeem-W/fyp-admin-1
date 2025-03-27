import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import { Header } from "components";

const initialTasks = [
  { id: 1, name: "Feed fish", date: "2025-03-16", status: "Pending" },
  { id: 2, name: "Clean pond", date: "2025-03-16", status: "Pending" },
];

const Tasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newTaskName, setNewTaskName] = useState("");

  const handleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: "Completed" } : task
      )
    );
  };

  const handleDateChange = (e) => {
    setCurrentDate(new Date(e.target.value));
  };

  const handleAddTask = () => {
    if (newTaskName.trim() === "") return;
    const newTask = {
      id: tasks.length + 1,
      name: newTaskName,
      date: format(currentDate, "yyyy-MM-dd"),
      status: "Pending",
    };
    setTasks([...tasks, newTask]);
    setNewTaskName("");
  };

  const filteredTasks = tasks.filter(
    (task) => task.date === format(currentDate, "yyyy-MM-dd")
  );

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Tasks" subtitle="Manage your daily pond tasks" />

      <Box display="flex" gap={2} alignItems="center" my={2}>
        <TextField
          type="date"
          value={format(currentDate, "yyyy-MM-dd")}
          onChange={handleDateChange}
          label="Select Date"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="New Task"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddTask}>
          Add Task
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Task Name</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.date}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    {task.status === "Pending" ? (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleComplete(task.id)}
                      >
                        Mark as Completed
                      </Button>
                    ) : (
                      <Typography color="green">Done</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No tasks for this date.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Tasks;
