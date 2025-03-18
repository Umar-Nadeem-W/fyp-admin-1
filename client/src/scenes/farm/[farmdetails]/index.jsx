import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardContent, Grid, Button } from "@mui/material";

const FarmDetails = () => {
  const { farmId } = useParams();
  const [farm] = useState({
    name: "Green Valley Farm",
    address: "123 Farm Road",
    city: "Springfield",
    state: "Illinois",
    country: "USA",
    zip: "62704",
    number_of_ponds: 3,
    number_of_workers: 10,
  });

  const [ponds] = useState([
    { id: 1, name: "Pond A", type: "Clay", length: 20, width: 15, depth: 5, status: "Stable" },
    { id: 2, name: "Pond B", type: "Concrete", length: 25, width: 20, depth: 6, status: "Maintenance" },
    { id: 3, name: "Pond C", type: "Natural", length: 30, width: 25, depth: 7, status: "Empty" },
  ]);

  return (
    <Box m={3}>
      <Typography variant="h4" gutterBottom>{farm.name}</Typography>
      <Typography variant="body1">Address: {farm.address}, {farm.city}, {farm.state}, {farm.country} - {farm.zip}</Typography>
      <Typography variant="body1">Number of Ponds: {farm.number_of_ponds}</Typography>
      <Typography variant="body1">Number of Workers: {farm.number_of_workers}</Typography>

      <Typography variant="h5" mt={4} mb={2}>Ponds</Typography>
      {ponds.length > 0 ? (
        <Grid container spacing={3}>
          {ponds.map((pond) => (
            <Grid item key={pond.id} xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: "12px", boxShadow: "2px 4px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
                <CardContent>
                  <Typography variant="h6" color="primary">{pond.name}</Typography>
                  <Typography variant="body2" color="textSecondary">Type: {pond.type}</Typography>
                  <Typography variant="body2" color="textSecondary">Size: {pond.length}m × {pond.width}m × {pond.depth}m</Typography>
                  <Typography variant="body2" color="textSecondary">Status: {pond.status}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="textSecondary">No ponds available</Typography>
      )}

      <Button variant="contained" sx={{ mt: 3 }}>Back to Farms</Button>
    </Box>
  );
};

export default FarmDetails;