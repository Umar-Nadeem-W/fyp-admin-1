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

const FishStock = () => {
  const [fishStockData, setFishStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFishStock = async () => {
    try {
      const token = localStorage.getItem("token"); // replace if you're using cookies or other auth

      const res = await axios.get("http://localhost:5000/api/worker/worker/fish-stock", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFishStockData(res.data);
    } catch (error) {
      console.error("Failed to fetch fish stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFishStock();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Fish Stock
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Pond ID</TableCell>
                <TableCell>Fish ID</TableCell>
                <TableCell>Species</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Date of Stocking</TableCell>
                <TableCell>Age at Stocking (months)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fishStockData.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>{stock.id}</TableCell>
                  <TableCell>{stock.pond_id}</TableCell>
                  <TableCell>{stock.fish_id}</TableCell>
                  <TableCell>{stock.species}</TableCell>
                  <TableCell>{stock.quantity}</TableCell>
                  <TableCell>{stock.date_of_stocking}</TableCell>
                  <TableCell>{stock.age_at_stocking}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FishStock;
