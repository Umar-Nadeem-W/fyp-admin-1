import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PondListPage = () => {
  const [ponds, setPonds] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();

  const farmId = location?.state?.farmId;
  const farmName = location?.state?.farmName;

  useEffect(() => {
    if (farmId) {
      fetchPonds();
    }
    // eslint-disable-next-line
  }, [farmId]);

  const fetchPonds = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/farms/${farmId}/ponds`);
      setPonds(response.data);
    } catch (error) {
      console.error("Error fetching ponds:", error);
    }
  };


  return (
    <Box p={isSmallScreen ? 2 : 4}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Back
      </Button>

      <Typography variant="h4" gutterBottom>
        Ponds in {farmName || "Selected Farm"}
      </Typography>

      {ponds.length === 0 ? (
        <Typography>No ponds found for this farm.</Typography>
      ) : (
        <Grid container spacing={2}>
          {ponds.map((pond) => (
            <Grid item xs={12} sm={6} md={4} key={pond.id}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6">{pond.name}</Typography>
                <Typography variant="body2">Type: {pond.type}</Typography>
                <Typography variant="body2">
                  Size: {pond.length}m × {pond.width}m × {pond.depth}m
                </Typography>
                <Typography variant="body2">Status: {pond.status}</Typography>

                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/pond/ponddetails/${pond.id}`);
                  }}
                >
                  View Details
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PondListPage;
