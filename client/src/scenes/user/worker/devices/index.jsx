import React, { useEffect, useState } from "react";
import {
  Box,
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
import axios from "axios";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get token and user ID from localStorage or your auth system
  const token = localStorage.getItem("token"); // adjust if using cookies or context
  const userId = localStorage.getItem("u_id"); // replace with session or context-based ID if needed

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/worker/worker/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDevices(response.data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [userId, token]);

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Devices</Typography>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Device ID</TableCell>
                <TableCell>Device Name</TableCell>
                <TableCell>Device Type</TableCell>
                <TableCell>Sensors</TableCell>
                <TableCell>Installation Date</TableCell>
                <TableCell>Pond ID</TableCell>
                <TableCell>Pond Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.device_id}>
                  <TableCell>{device.device_id}</TableCell>
                  <TableCell>{device.device_name}</TableCell>
                  <TableCell>{device.device_type}</TableCell>
                  <TableCell>
                    {Array.isArray(device.sensors)
                      ? device.sensors.map((s, i) => `${s.sensor_type} (${s.unit})`).join(", ")
                      : device.sensors}
                  </TableCell>
                  <TableCell>{new Date(device.installation_date).toLocaleDateString()}</TableCell>
                  <TableCell>{device.pond_id}</TableCell>
                  <TableCell>{device.pond_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Devices;
