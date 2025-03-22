import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FarmDetails = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Hardcoded farm and pond data
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

  // Real-time (mocked) sensor values
  const [sensorData, setSensorData] = useState({
    pH: 7.2,
    temperature: 26.4,
    turbidity: 14,
  });

  // Mocked time-series data for plots
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPoint = {
        time: new Date().toLocaleTimeString(),
        pH: parseFloat((6.8 + Math.random()).toFixed(2)),
        temperature: parseFloat((25 + Math.random() * 3).toFixed(1)),
        turbidity: Math.floor(10 + Math.random() * 10),
      };
      setSensorData({ pH: newPoint.pH, temperature: newPoint.temperature, turbidity: newPoint.turbidity });
      setChartData((prev) => [...prev.slice(-19), newPoint]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box m={isSmallScreen ? 2 : 4}>
      <Typography variant="h4" gutterBottom>{farm.name}</Typography>
      <Typography variant="body1" mb={2}>
        Address: {farm.address}, {farm.city}, {farm.state}, {farm.country} - {farm.zip}
      </Typography>
      <Typography variant="body1">Number of Ponds: {farm.number_of_ponds}</Typography>
      <Typography variant="body1" mb={4}>Number of Workers: {farm.number_of_workers}</Typography>

      {/* Real-time Sensor Summary */}
      <Grid container spacing={2} mb={4}>
        {[
          { label: "pH Level", value: sensorData.pH, unit: "" },
          { label: "Temperature", value: sensorData.temperature, unit: "°C" },
          { label: "Turbidity", value: sensorData.turbidity, unit: "NTU" },
        ].map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ backgroundColor: "black" }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">{item.label}</Typography>
                <Typography variant="h5">
                  {item.value} {item.unit}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Real-time Charts */}
      <Typography variant="h5" mb={2}>Live Sensor Readings</Typography>

      <Grid container spacing={4}>
        {["pH", "temperature", "turbidity"].map((type) => (
          <Grid item xs={12} md={4} key={type}>
            <Typography variant="subtitle1" mb={1}>{type.charAt(0).toUpperCase() + type.slice(1)} Trend</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey={type} stroke="#1976d2" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        ))}
      </Grid>

      {/* Pond List */}
      <Typography variant="h5" mt={5} mb={2}>Ponds</Typography>
      <Grid container spacing={3}>
        {ponds.map((pond) => (
          <Grid item key={pond.id} xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: "12px", boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary">{pond.name}</Typography>
                <Typography variant="body2" color="textSecondary">Type: {pond.type}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Size: {pond.length}m × {pond.width}m × {pond.depth}m
                </Typography>
                <Typography variant="body2" color="textSecondary">Status: {pond.status}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button variant="contained" sx={{ mt: 4 }} onClick={() => navigate("/farm")}>
        Back to Farms
      </Button>
    </Box>
  );
};

export default FarmDetails;
