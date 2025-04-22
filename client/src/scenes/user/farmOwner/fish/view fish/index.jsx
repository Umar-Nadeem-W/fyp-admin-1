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

const Fish = () => {
  const navigate = useNavigate();
  const fishStocks = [
    {
      id: 1,
      pond_id: "Pond A",
      fish_species: "Tilapia",
      quantity: 200,
      date_of_stocking: "2023-01-10",
      age_at_stocking: "2 months",
      optimal_ph: "6.5-8.5",
      optimal_temperature: "25-30°C",
      optimal_turbidity: "10-20 NTU",
    },
    {
      id: 2,
      pond_id: "Pond B",
      fish_species: "Catfish",
      quantity: 150,
      date_of_stocking: "2023-02-15",
      age_at_stocking: "3 months",
      optimal_ph: "6.0-8.0",
      optimal_temperature: "22-28°C",
      optimal_turbidity: "15-25 NTU",
    },
    // Add more dummy data as needed
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Fish Stocks</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/fish/add-fish")}
        >
          Add New Fish Stock
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Pond ID</TableCell>
              <TableCell>Fish Species</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Date of Stocking</TableCell>
              <TableCell>Age at Stocking</TableCell>
              <TableCell>Optimal pH</TableCell>
              <TableCell>Optimal Temperature</TableCell>
              <TableCell>Optimal Turbidity</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>View Stats</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fishStocks.map((fish) => (
              <TableRow key={fish.id}>
                <TableCell>{fish.id}</TableCell>
                <TableCell>{fish.pond_id}</TableCell>
                <TableCell>{fish.fish_species}</TableCell>
                <TableCell>{fish.quantity}</TableCell>
                <TableCell>{fish.date_of_stocking}</TableCell>
                <TableCell>{fish.age_at_stocking}</TableCell>
                <TableCell>{fish.optimal_ph}</TableCell>
                <TableCell>{fish.optimal_temperature}</TableCell>
                <TableCell>{fish.optimal_turbidity}</TableCell>
                <TableCell>
                  <Button onClick={() => alert(`Edit fish stock: ${fish.fish_species}`)}>
                    <Edit />
                  </Button>
                  <Button
                    onClick={() => alert(`Delete fish stock: ${fish.fish_species}`)}
                    sx={{ color: "red" }}
                  >
                    <Delete />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/fish/fish-details")}
                  >
                    View Stats
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

export default Fish;