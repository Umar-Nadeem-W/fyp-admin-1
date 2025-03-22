import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Header } from "components";
import axios from "axios";

const initialWorkerState = {
  designation: "",
  status: "not approved",
  manage_transactions: false,
};

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [workerData, setWorkerData] = useState(initialWorkerState);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/workers");
      setWorkers(response.data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const handleOpenForm = (worker = null) => {
    if (worker) {
      setSelectedWorker(worker.w_id);
      setWorkerData(worker);
    } else {
      setSelectedWorker(null);
      setWorkerData(initialWorkerState);
    }
    setShowFormDialog(true);
  };

  const handleCloseForm = () => {
    setSelectedWorker(null);
    setWorkerData(initialWorkerState);
    setShowFormDialog(false);
  };

  const handleFormSubmit = async () => {
    try {
      if (selectedWorker) {
        await axios.put(`http://localhost:5000/api/workers/${selectedWorker}`, workerData);
      } else {
        await axios.post("http://localhost:5000/api/workers", workerData);
      }
      fetchWorkers();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving worker:", error);
    }
  };

  const handleDelete = async (w_id) => {
    try {
      await axios.delete(`http://localhost:5000/api/workers/${w_id}`);
      fetchWorkers();
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

  return (
    <Box p={isSmallScreen ? 2 : 4}>
      <Header title="Workers" subtitle="Manage farm workers" />

      <Button
        variant="contained"
        onClick={() => handleOpenForm()}
        sx={{ mt: 2, mb: 2 }}
      >
        Add Worker
      </Button>

      <Typography variant="h5" gutterBottom>
        Workers List
      </Typography>

      {workers.length > 0 ? (
        <Grid container spacing={2}>
          {workers.map((worker) => (
            <Grid item xs={12} sm={6} md={4} key={worker.w_id}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Worker #{worker.w_id}
                </Typography>
                <Typography variant="body2">
                  Designation: {worker.designation}
                </Typography>
                <Typography variant="body2" mt={1}>
                  Status:{" "}
                  <Chip
                    label={worker.status}
                    color={
                      worker.status === "approved"
                        ? "success"
                        : worker.status === "pending"
                        ? "warning"
                        : "default"
                    }
                    size="small"
                  />
                </Typography>
                <Typography variant="body2" mt={1}>
                  Transactions Access:{" "}
                  <Chip
                    label={worker.manage_transactions ? "Allowed" : "Denied"}
                    color={worker.manage_transactions ? "primary" : "error"}
                    size="small"
                  />
                </Typography>

                <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleOpenForm(worker)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(worker.w_id)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      alert(JSON.stringify(worker, null, 2))
                    }
                  >
                    View Details
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No workers found.</Typography>
      )}

      {/* Dialog for Add/Edit Form */}
      <Dialog open={showFormDialog} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedWorker ? "Edit Worker" : "Add New Worker"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Designation"
            name="designation"
            value={workerData.designation}
            onChange={(e) =>
              setWorkerData({ ...workerData, designation: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Status"
            name="status"
            value={workerData.status}
            onChange={(e) =>
              setWorkerData({ ...workerData, status: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Manage Transactions (true/false)"
            name="manage_transactions"
            value={workerData.manage_transactions}
            onChange={(e) =>
              setWorkerData({
                ...workerData,
                manage_transactions: e.target.value === "true",
              })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">
            {selectedWorker ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Workers;
