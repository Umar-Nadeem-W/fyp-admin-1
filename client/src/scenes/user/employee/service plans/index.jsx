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
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const ServicePlans = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [servicePlans, setServicePlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServicePlans = async () => {
    try {
      const token = localStorage.getItem("token"); // token must be already saved in localStorage

      const response = await axios.get("/api/employee/packages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setServicePlans(response.data);
    } catch (error) {
      console.error("Error fetching service plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicePlans();
  }, []);

  const filteredPlans = servicePlans.filter((plan) =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          mb: 2,
          gap: 2,
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
