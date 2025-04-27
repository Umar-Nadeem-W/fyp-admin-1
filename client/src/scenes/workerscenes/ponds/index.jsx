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
import { useNavigate } from "react-router-dom";
const Ponds = () => {
  const navigate = useNavigate(); // Add navigate hook
  const farmId = 101; // Hardcoded Farm ID
  const ponds = [
    {
      id: 1,
      farm_id: 101,
      name: "Pond A",
      type: "Clay",
      length: 50,
      width: 30,
      depth: 10,
      status: "Stable",
      health_percentage: 90, // Added health percentage
    },
    {
      id: 2,
      farm_id: 102,
      name: "Pond B",
      type: "Concrete",
      length: 60,
      width: 40,
      depth: 15,
      status: "Healthy",
      health_percentage: 95, // Added health percentage
    },
    {
      id: 3,
      farm_id: 103,
      name: "Pond C",
      type: "Clay",
      length: 70,
      width: 50,
      depth: 20,
      status: "Warning",
      health_percentage: 70, // Added health percentage
    },
  ];

  // Filter ponds by the hardcoded Farm ID
  const filteredPonds = ponds.filter((pond) => pond.farm_id === farmId);

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Ponds</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Farm ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Length</TableCell>
              <TableCell>Width</TableCell>
              <TableCell>Depth</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Health Percentage</TableCell> {/* New column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPonds.map((pond) => (
              <TableRow key={pond.id}>
                <TableCell>{pond.id}</TableCell>
                <TableCell>{pond.farm_id}</TableCell>
                <TableCell>{pond.name}</TableCell>
                <TableCell>{pond.type}</TableCell>
                <TableCell>{pond.length}</TableCell>
                <TableCell>{pond.width}</TableCell>
                <TableCell>{pond.depth}</TableCell>
                <TableCell>{pond.status}</TableCell>
                <TableCell>{pond.health_percentage}%</TableCell> {/* New data */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Ponds;
