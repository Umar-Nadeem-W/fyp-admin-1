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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Devices = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    manufacturer: "",
    model: "",
    serial_number: "",
    status: "",
    sensors: "[]",
  });

  const fetchDevices = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("No token found. Please log in.");

    try {
      const response = await axios.get("http://localhost:5000/api/owner/get-devices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDevices(response.data);
    } catch (error) {
      console.error("Error fetching devices:", error.response?.data || error.message);
      alert("❌ Failed to load devices");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!selectedDevice) return;

    try {
      await axios.delete(`http://localhost:5000/api/owner/delete-device/${selectedDevice.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeleteDialogOpen(false);
      setSelectedDevice(null);
      fetchDevices();
    } catch (error) {
      console.error("Error deleting device:", error.response?.data || error.message);
      alert("❌ Failed to delete device");
    }
  };

  const handleEditOpen = (device) => {
    setSelectedDevice(device);
    setEditForm({
      name: device.name || "",
      type: device.type || "",
      manufacturer: device.manufacturer || "",
      model: device.model || "",
      serial_number: device.serial_number || "",
      status: device.status || "",
      sensors: (() => {
        try {
          return JSON.stringify(Array.isArray(device.sensors) ? device.sensors : JSON.parse(device.sensors), null, 2);
        } catch {
          return "[]";
        }
      })(),
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!selectedDevice) return;

    try {
      await axios.put(
        `http://localhost:5000/api/owner/update-device/${selectedDevice.id}`,
        {
          ...editForm,
          sensors: JSON.parse(editForm.sensors),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditDialogOpen(false);
      fetchDevices();
    } catch (error) {
      console.error("Error updating device:", error.response?.data || error.message);
      alert("❌ Failed to update device. Make sure sensors is valid JSON.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Devices</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/adddevice")}>
          Add New Device
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Manufacturer</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Serial Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Sensors</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.id}</TableCell>
                  <TableCell>{device.name}</TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell>{device.manufacturer}</TableCell>
                  <TableCell>{device.model}</TableCell>
                  <TableCell>{device.serial_number}</TableCell>
                  <TableCell>{device.status}</TableCell>
                  <TableCell>
                    {Array.isArray(device.sensors)
                      ? device.sensors.map((s) => `${s.sensor_type} (${s.unit})`).join(", ")
                      : (() => {
                          try {
                            const parsed = JSON.parse(device.sensors);
                            return Array.isArray(parsed)
                              ? parsed.map((s) => `${s.sensor_type} (${s.unit})`).join(", ")
                              : device.sensors;
                          } catch {
                            return device.sensors;
                          }
                        })()}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditOpen(device)}>
                      <Edit />
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedDevice(device);
                        setDeleteDialogOpen(true);
                      }}
                      sx={{ color: "red" }}
                    >
                      <Delete />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{selectedDevice?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Device</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Name" name="name" value={editForm.name} onChange={handleEditChange} fullWidth />
          <TextField label="Type" name="type" value={editForm.type} onChange={handleEditChange} fullWidth />
          <TextField label="Manufacturer" name="manufacturer" value={editForm.manufacturer} onChange={handleEditChange} fullWidth />
          <TextField label="Model" name="model" value={editForm.model} onChange={handleEditChange} fullWidth />
          <TextField label="Serial Number" name="serial_number" value={editForm.serial_number} onChange={handleEditChange} fullWidth />
          <TextField label="Status" name="status" value={editForm.status} onChange={handleEditChange} fullWidth />
          <TextField
            label="Sensors (JSON Array)"
            name="sensors"
            value={editForm.sensors}
            onChange={handleEditChange}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Devices;
