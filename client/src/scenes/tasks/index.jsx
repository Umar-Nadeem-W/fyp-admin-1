import React, { useState } from "react";
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";
import { Header } from "components";
import { format } from "date-fns";

const initialTasks = [
  { id: 1, name: "Feed fish", date: "2025-03-16", status: "Pending" },
  { id: 2, name: "Clean pond", date: "2025-03-16", status: "Pending" },
];

const Tasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: "Complete" } : task
    ));
  };

  const handleDateChange = (e) => {
    setCurrentDate(new Date(e.target.value));
  };

  const filteredTasks = tasks.filter(task => task.date === format(currentDate, "yyyy-MM-dd"));

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Tasks" subtitle="See your list of tasks." />

      <Box display="flex" alignItems="center" gap={2} my={2}>
        <TextField
          type="date"
          value={format(currentDate, "yyyy-MM-dd")}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Date Assigned</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.date}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    {task.status === "Pending" && (
                      <Button variant="contained" color="primary" onClick={() => handleComplete(task.id)}>
                        Mark as Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">No tasks for this date.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Tasks;
