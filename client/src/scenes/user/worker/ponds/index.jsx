// Ponds.jsx
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
} from "@mui/material";
import axios from "axios";

const Ponds = () => {
  const [ponds, setPonds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPonds = async () => {
    try {
      const token = localStorage.getItem("token"); // Save JWT here after login
      const res = await axios.get("http://localhost:5000/api/worker/ponds", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPonds(res.data);
    } catch (error) {
      console.error("Error fetching ponds:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPonds();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Ponds
      </Typography>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Ponds;