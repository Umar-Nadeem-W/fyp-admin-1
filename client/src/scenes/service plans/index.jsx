import React, { useState } from "react";
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
  TextField,
} from "@mui/material";

const ServicePlans = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const servicePlans = [
    {
      id: 1,
      name: "Basic Plan",
      description: "Starter package for small farms",
      price: "49.99",
      duration: "30",
      max_sites: "1",
      max_ponds: "2",
      max_workers: "5",
    },
    {
      id: 2,
      name: "Standard Plan",
      description: "Ideal for medium-sized farms",
      price: "99.99",
      duration: "30",
      max_sites: "3",
      max_ponds: "5",
      max_workers: "15",
    },
    {
      id: 3,
      name: "Premium Plan",
      description: "Comprehensive package for large farms",
      price: "199.99",
      duration: "30",
      max_sites: "10",
      max_ponds: "20",
      max_workers: "50",
    },
  ];

  const filteredPlans = servicePlans.filter((plan) =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          mb: 2,
          gap: 2, // Add spacing between heading and search bar
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold" }}>
          Packages
        </Typography>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "800px" }}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Duration (Days)</TableCell>
              <TableCell>Max Sites</TableCell>
              <TableCell>Max Ponds</TableCell>
              <TableCell>Max Workers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.id}</TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell>${plan.price}</TableCell>
                <TableCell>{plan.duration}</TableCell>
                <TableCell>{plan.max_sites}</TableCell>
                <TableCell>{plan.max_ponds}</TableCell>
                <TableCell>{plan.max_workers}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ServicePlans;