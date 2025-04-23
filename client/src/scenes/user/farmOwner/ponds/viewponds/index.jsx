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
const Ponds = () => {
   const navigate = useNavigate(); // Add navigate hook
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
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Ponds</Typography>
        <Button variant="contained" color="primary" onClick={()=>{navigate('/addpond')}}>
          Add New Pond
        </Button>
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ponds.map((pond) => (
              <TableRow key={pond.id}>
                <TableCell>{pond.id}</TableCell>
                <TableCell>{pond.farm_id}</TableCell>
                <TableCell>{pond.name}</TableCell>
                <TableCell>{pond.type}</TableCell>
                <TableCell>{pond.length}</TableCell>
                <TableCell>{pond.width}</TableCell>
                <TableCell>{pond.depth}</TableCell>
                <TableCell>{pond.status}</TableCell>
                <TableCell>
                  <Button onClick={() => alert(`Edit pond: ${pond.name}`)}>
                    <Edit />
                  </Button>
                  <Button onClick={() => alert(`Delete pond: ${pond.name}`)} sx={{ color: "red" }}>
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

export default Ponds;
