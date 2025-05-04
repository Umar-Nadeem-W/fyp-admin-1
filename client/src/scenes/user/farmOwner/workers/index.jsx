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
  MenuItem,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Header } from "components";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/owner";

const initialWorkerState = {
  email: "",
  designation: "",
  status: "Active", // Changed from "not approved" to "Active" to match backend
  manage_transactions: false,
  farm_id: "",
};

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [farms, setFarms] = useState([]);
  const [workerData, setWorkerData] = useState(initialWorkerState);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchWorkers();
    fetchFarms();
  }, []);

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const fetchWorkers = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/get-workers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkers(response.data);
    } catch (error) {
      console.error("Error fetching workers:", error);
      showNotification("Failed to fetch workers. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchFarms = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_BASE_URL}/get-farms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarms(response.data.farms || []);
    } catch (error) {
      console.error("Error fetching farms:", error);
      showNotification("Failed to fetch farms. Please check your connection.", "error");
    }
  };

  const handleOpenForm = (worker = null) => {
    if (worker) {
      setSelectedWorker(worker.w_id);
      setWorkerData({
        email: worker.email || "",
        designation: worker.designation,
        status: worker.status,
        manage_transactions: worker.manage_transactions,
        farm_id: worker.farm_id,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "manage_transactions") {
      setWorkerData({ ...workerData, [name]: value === "true" });
    } else {
      setWorkerData({ ...workerData, [name]: value });
    }
  };

  const handleAddWorker = async () => {
    if (!workerData.email || !workerData.farm_id) {
      showNotification("Email and Farm selection are required", "error");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/add-worker`,
        {
          farmId: workerData.farm_id,
          email: workerData.email,
          designation: workerData.designation,
          manageTransactions: workerData.manage_transactions,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification("Worker added successfully", "success");
      fetchWorkers();
      handleCloseForm();
    } catch (error) {
      console.error("Error adding worker:", error);
      const errorMsg = error.response?.data?.error || "Error adding worker";
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWorker = async () => {
    if (!workerData.designation) {
      showNotification("Designation is required", "error");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/update-farm-worker/${selectedWorker}`,
        {
          designation: workerData.designation,
          manageTransactions: workerData.manage_transactions,
          status: workerData.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification("Worker updated successfully", "success");
      fetchWorkers();
      handleCloseForm();
    } catch (error) {
      console.error("Error updating worker:", error);
      const errorMsg = error.response?.data?.error || "Error updating worker";
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (w_id) => {
    const confirm = window.confirm("Are you sure you want to remove this worker?");
    if (!confirm) return;

    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/remove-worker/${w_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("Worker removed successfully", "success");
      fetchWorkers();
    } catch (error) {
      console.error("Error deleting worker:", error);
      showNotification("Failed to remove worker", "error");
    } finally {
      setLoading(false);
    }
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.id === farmId);
    return farm ? farm.name : `Farm #${farmId}`;
  };

  return (
    <Box p={isSmallScreen ? 2 : 4}>
      <Header title="Workers" subtitle="Manage farm workers" />

      <Button 
        variant="contained" 
        onClick={() => handleOpenForm()} 
        sx={{ mt: 2, mb: 2 }}
        disabled={loading}
      >
        Add Worker
      </Button>

      <Typography variant="h5" gutterBottom>
        Workers List
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : workers.length > 0 ? (
        <Grid container spacing={2}>
          {workers.map((worker) => (
            <Grid item xs={12} sm={6} md={4} key={worker.w_id}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {worker.user_name || worker.email}
                </Typography>
                <Typography variant="body2">Email: {worker.email}</Typography>
                <Typography variant="body2">Designation: {worker.designation}</Typography>
                <Typography variant="body2">Farm: {getFarmName(worker.farm_id)}</Typography>
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
                  <Button size="small" variant="outlined" onClick={() => handleOpenForm(worker)}>
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
        <DialogTitle>{selectedWorker ? "Edit Worker" : "Add New Worker"}</DialogTitle>
        <DialogContent>
          {!selectedWorker && (
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={workerData.email}
              onChange={handleInputChange}
              margin="normal"
              required
            />
          )}

          {!selectedWorker && (
            <TextField
              fullWidth
              select
              label="Select Farm"
              name="farm_id"
              value={workerData.farm_id}
              onChange={handleInputChange}
              margin="normal"
              required
            >
              <MenuItem value="">Select a farm</MenuItem>
              {farms.map((farm) => (
                <MenuItem key={farm.id} value={farm.id}>
                  {farm.name} (#{farm.id})
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            fullWidth
            label="Designation"
            name="designation"
            value={workerData.designation}
            onChange={handleInputChange}
            margin="normal"
            required
          />

          {selectedWorker && (
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={workerData.status}
              onChange={handleInputChange}
              margin="normal"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          )}

          <TextField
            fullWidth
            select
            label="Manage Transactions"
            name="manage_transactions"
            value={workerData.manage_transactions.toString()}
            onChange={handleInputChange}
            margin="normal"
          >
            <MenuItem value="true">Allowed</MenuItem>
            <MenuItem value="false">Denied</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} disabled={loading}>Cancel</Button>
          <Button
            onClick={selectedWorker ? handleUpdateWorker : handleAddWorker}
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              selectedWorker ? "Update" : "Add"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Workers;