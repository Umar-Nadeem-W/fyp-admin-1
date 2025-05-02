import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // <- Correct import

const ViewPond = () => {
  const [ponds, setPonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const farmId = localStorage.getItem("farmId");
  const navigate = useNavigate();  // <- Correct usage

  useEffect(() => {
    const fetchPonds = async () => {
      if (!token || !farmId) {
        alert("User not authenticated or farm not selected.");
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/api/owner/get-ponds-by-farm/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Ponds API response:", response.data);
        setPonds(response.data);
        // navigate("/ponds");  // ❌ Remove this
      } catch (error) {
        console.error("Error fetching ponds:", error.response?.data || error.message);
        alert("❌ Failed to fetch ponds");
      } finally {
        setLoading(false);
      }
    };

    fetchPonds();
  }, [token, farmId, navigate]); // <- Added navigate in dependency (optional best practice)

  if (loading) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ponds.length) {
    return <Typography sx={{ padding: 3 }}>No ponds found</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        All Ponds
      </Typography>
      <Paper elevation={3}>
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
      </Paper>
    </Box>
  );
};

export default ViewPond;
