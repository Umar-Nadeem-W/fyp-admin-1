import React, { useState, useEffect, useCallback } from "react";
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
  FormControlLabel,
  Switch,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Header } from "components";
import axios from "axios";

const initialWorkerState = {
  email: "",
  designation: "",
  manage_transactions: false,
};

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [workerData, setWorkerData] = useState(initialWorkerState);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const token = localStorage.getItem("token");

  // 🟡 Wrap fetchWorkers in useCallback to fix eslint warning
  const fetchWorkers = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/owner/get-workers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWorkers(response.data);
    } catch (error) {
      console.error("Error fetching workers:", error);
      alert("❌ Failed to fetch workers.");
    }
  }, [token]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const handleOpenForm = (worker = null) => {
    if (worker) {
      setSelectedWorker(worker.w_id);
      setWorkerData({
        designation: worker.designation,
        manage_transactions: worker.manage_transactions,
      });
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

  // 🔵 Handle Add Worker
  const handleAddWorker = async () => {
    try {
      const farmId = localStorage.getItem("farmId");

      await axios.post(
        "http://localhost:5000/api/owner/add-worker",
        {
          farmId: farmId,
          email: workerData.email,
          designation: workerData.designation,
          manageTransactions: workerData.manage_transactions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchWorkers();
      handleCloseForm();
      alert("✅ Worker added successfully!");
    } catch (error) {
      console.error("Error adding worker:", error.response?.data || error.message);
      alert("❌ Failed to add worker.");
    }
  };

  // 🟠 Handle Edit Worker
  const handleEditWorker = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/owner/update-farm-worker/${selectedWorker}`,
        {
          designation: workerData.designation,
          manageTransactions: workerData.manage_transactions,
          status: workerData.status, // 🚨 Check: workerData.status undefined if not set properly
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchWorkers();
      handleCloseForm();
      alert("✅ Worker updated successfully!");
    } catch (error) {
      console.error("Error updating worker:", error.response?.data || error.message);
      alert("❌ Failed to update worker.");
    }
  };

  // 🔴 Handle Delete Worker
  const handleDeleteWorker = async (workerId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/owner/remove-worker/${workerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchWorkers();
      alert("✅ Worker deleted successfully!");
    } catch (error) {
      console.error("Error deleting worker:", error);
      alert("❌ Failed to delete worker.");
    }
  };

  const handleFormSubmit = () => {
    if (selectedWorker) {
      handleEditWorker();
    } else {
      handleAddWorker();
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
                  {worker.user_name}
                </Typography>
                <Typography variant="body2">Email: {worker.email}</Typography>
                <Typography variant="body2">Designation: {worker.designation}</Typography>
                <Typography variant="body2" mt={1}>
                  Status:{" "}
                  <Chip
                    label={worker.status}
                    color={
                      worker.status === "Active"
                        ? "success"
                        : worker.status === "Pending"
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
                    onClick={() => handleDeleteWorker(worker.w_id)}
                  >
                    Delete
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
          {!selectedWorker && (
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={workerData.email}
              onChange={(e) =>
                setWorkerData({ ...workerData, email: e.target.value })
              }
              margin="normal"
            />
          )}
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
          <FormControlLabel
            control={
              <Switch
                checked={workerData.manage_transactions}
                onChange={(e) =>
                  setWorkerData({
                    ...workerData,
                    manage_transactions: e.target.checked,
                  })
                }
              />
            }
            label="Manage Transactions"
            sx={{ mt: 2 }}
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
