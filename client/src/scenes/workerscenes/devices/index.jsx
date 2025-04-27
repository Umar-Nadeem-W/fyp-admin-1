//WE NEED TO ADD LOGIC OF INSTALLATIONS
//AND POND /DEVICE ID LINKS
// SO THAT ONLY POND RELAVENT DEVICES ARE SHOWN
//Logic is there bu values hardcoded for now


import React from "react";
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
} from "@mui/material";

const Devices = () => {
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

  // Hardcoded logic for installation and pond ID
  const getPondIdByDeviceId = (deviceId) => {
    const installationId = 1; // Hardcoded installation ID
    const pondId = 1; // Hardcoded pond ID
    return deviceId === 1 ? pondId : null; // Only return pond ID for device ID 1
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Devices</Typography>
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
              <TableCell>Installed Pond ID</TableCell>
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
                <TableCell>{getPondIdByDeviceId(device.id) || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Devices;
