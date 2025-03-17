import React, { useState } from "react";
import { Box, Typography, MenuItem, Select, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Header } from "components";

const pondData = [
  {
    id: 1,
    name: "Pond A",
    species: "Tilapia",
    fishStocked: 200,
    waterTemp: 26,
    turbidity: 5,
    ph: 7.5,
    averages: {
      waterTemp: 25,
      turbidity: 5.5,
      ph: 7.4,
    },
    healthScore: 85,
  },
  {
    id: 2,
    name: "Pond B",
    species: "Catfish",
    fishStocked: 150,
    waterTemp: 24,
    turbidity: 6,
    ph: 7.2,
    averages: {
      waterTemp: 23,
      turbidity: 6.1,
      ph: 7.3,
    },
    healthScore: 78,
  },
];

const Analytics = () => {
  const [selectedPond, setSelectedPond] = useState(pondData[0]);

  const handlePondChange = (e) => {
    const pond = pondData.find(p => p.id === e.target.value);
    setSelectedPond(pond);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Analytics" subtitle="View Pond Analytics." />

      <Select value={selectedPond.id} onChange={handlePondChange} displayEmpty sx={{ mb: 3 }}>
        {pondData.map(pond => (
          <MenuItem key={pond.id} value={pond.id}>{pond.name}</MenuItem>
        ))}
      </Select>

      <Typography variant="h5" mb={2}>{selectedPond.species} - {selectedPond.fishStocked} Fish Stocked</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}><Typography variant="h6">Current Measurements</Typography></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Parameter</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Water Temperature</TableCell>
                  <TableCell>{selectedPond.waterTemp}°C</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Turbidity</TableCell>
                  <TableCell>{selectedPond.turbidity} NTU</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>pH Level</TableCell>
                  <TableCell>{selectedPond.ph}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}><Typography variant="h6">5-Day Averages</Typography></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Parameter</TableCell>
                  <TableCell>Average Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Water Temperature</TableCell>
                  <TableCell>{selectedPond.averages.waterTemp}°C</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Turbidity</TableCell>
                  <TableCell>{selectedPond.averages.turbidity} NTU</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>pH Level</TableCell>
                  <TableCell>{selectedPond.averages.ph}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Fish Health Score</Typography>
              <Typography variant="h4" color="primary">{selectedPond.healthScore}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;