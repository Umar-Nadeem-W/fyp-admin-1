import React from "react";
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Devices = () => {
  const navigate = useNavigate();
  const devices = [
    {
      id: 1,
      name: "Water Sensor",
      type: "Sensor",
      manufacturer: "Company A",
      model: "WS-100",
      serial_number: "SN12345",
      status: "Active",
      sensors: "pH, Temp, Turbidity",
    },
    {
      id: 2,
      name: "Actuator X",
      type: "Actuator",
      manufacturer: "Company B",
      model: "AX-200",
      serial_number: "SN67890",
      status: "Inactive",
      sensors: "N/A",
    },
    // Add more dummy data as needed
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Devices</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/adddevice")}>
          Add New Device
        </Button>
      </Box>
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
                <TableCell>{device.sensors}</TableCell>
                <TableCell>
                  <Button onClick={() => alert(`Edit device: ${device.name}`)}>
                    <Edit />
                  </Button>
                  <Button onClick={() => alert(`Delete device: ${device.name}`)} sx={{ color: "red" }}>
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

export default Devices;
