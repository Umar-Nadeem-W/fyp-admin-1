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

const Installations = () => {
  const navigate = useNavigate();
  const installations = [
    {
      id: 1,
      device_id: "D123",
      pond_id: "P456",
      installed_by: "John Doe",
      installation_date: "2023-01-15",
      notes: "Initial installation",
    },
    {
      id: 2,
      device_id: "D789",
      pond_id: "P123",
      installed_by: "Jane Smith",
      installation_date: "2023-02-20",
      notes: "Replaced old device",
    },
    // Add more dummy data as needed
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Installations</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/installations/add-installation")}
        >
          Add New Installation
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Device ID</TableCell>
              <TableCell>Pond ID</TableCell>
              <TableCell>Installed By</TableCell>
              <TableCell>Installation Date</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {installations.map((installation) => (
              <TableRow key={installation.id}>
                <TableCell>{installation.id}</TableCell>
                <TableCell>{installation.device_id}</TableCell>
                <TableCell>{installation.pond_id}</TableCell>
                <TableCell>{installation.installed_by}</TableCell>
                <TableCell>{installation.installation_date}</TableCell>
                <TableCell>{installation.notes}</TableCell>
                <TableCell>
                  <Button onClick={() => alert(`Edit installation: ${installation.id}`)}>
                    <Edit />
                  </Button>
                  <Button
                    onClick={() => alert(`Delete installation: ${installation.id}`)}
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
    </Box>
  );
};

export default Installations;