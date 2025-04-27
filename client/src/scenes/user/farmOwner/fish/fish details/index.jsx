import React, { useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const FishDetails = () => {
  const [timeRange, setTimeRange] = useState("week");

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const data = {
    labels: timeRange === "day" ? ["6 AM", "12 PM", "6 PM", "12 AM"] : 
            timeRange === "week" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : 
            timeRange === "month" ? ["Week 1", "Week 2", "Week 3", "Week 4"] : 
            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Fish Health",
        data: timeRange === "day" ? [80, 85, 90, 88] : 
              timeRange === "week" ? [75, 80, 85, 90, 88, 92, 95] : 
              timeRange === "month" ? [70, 75, 80, 85] : 
              [70, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95, 97],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Fish Health Details
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <FormControl>
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            value={timeRange}
            onChange={handleTimeRangeChange}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="day">Last Day</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
        <Typography
          variant="h5"
          sx={{
            backgroundColor: "#4caf50",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
            boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          Estimated Profit: $12,000
        </Typography>
        <Typography
          variant="h5"
          sx={{
            backgroundColor: "#2196f3",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
            boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          Current Health: 79%
        </Typography>
      </Box>
      <Box sx={{ height: 400 }}>
        <Line data={data} />
      </Box>
    </Box>
  );
};

export default FishDetails;
