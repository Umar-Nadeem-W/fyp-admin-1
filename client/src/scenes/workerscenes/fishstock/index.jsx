//Need to make sure that only the stocking data 
//of those ponds to which the worker 
//is assigned to is shown.
//Current age= current date - date of stocking + age at stocking



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
import { current } from "@reduxjs/toolkit";

const FishStock = () => {
  const fishStockData = [
    {
      id: 1,
      pond_id: 101,
      fish_id: 201,
      quantity: 500,
      date_of_stocking: "2023-01-15",
      age_at_stocking: "2 months",
      current_age: "4 months",
    },
    {
      id: 2,
      pond_id: 102,
      fish_id: 202,
      quantity: 300,
      date_of_stocking: "2023-02-10",
      age_at_stocking: "3 months",
      current_age: "5 months",
    },
    // Add more dummy data as needed
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Fish Stock
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Pond ID</TableCell>
              <TableCell>Fish ID</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Date of Stocking</TableCell>
              <TableCell>Age at Stocking</TableCell>
              <TableCell>Current Age</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fishStockData.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>{stock.id}</TableCell>
                <TableCell>{stock.pond_id}</TableCell>
                <TableCell>{stock.fish_id}</TableCell>
                <TableCell>{stock.quantity}</TableCell>
                <TableCell>{stock.date_of_stocking}</TableCell>
                <TableCell>{stock.age_at_stocking}</TableCell>
                <TableCell>{stock.current_age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FishStock;