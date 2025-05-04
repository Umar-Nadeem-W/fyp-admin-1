import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { useLocation } from "react-router-dom";
import axios from "axios";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

const FishDetails = () => {
  const location = useLocation();
  const pondName = new URLSearchParams(location.search).get("pondName");

  const [dataType, setDataType] = useState("temp");
  const [timeRange, setTimeRange] = useState("all");
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPondData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/owner/get-pond-data/${pondName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRawData(response.data);
      } catch (error) {
        console.error("Error fetching pond data:", error);
        alert("❌ Failed to fetch pond data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPondData();
  }, [pondName]);

  useEffect(() => {
    const now = new Date();
    let rangeStart = null;

    if (timeRange === "today") {
      rangeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (timeRange === "week") {
      rangeStart = new Date();
      rangeStart.setDate(now.getDate() - 7);
    } else if (timeRange === "month") {
      rangeStart = new Date();
      rangeStart.setMonth(now.getMonth() - 1);
    }

    const processedData = rawData
      .filter((entry) => {
        if (!entry.recorded_at) return false;
        const entryDate = new Date(entry.recorded_at.replace(" ", "T"));
        if (timeRange === "all") return true;
        return entryDate >= rangeStart;
      })
      .map((entry) => ({
        x: new Date(entry.recorded_at.replace(" ", "T")).toLocaleString(),
        y: entry[dataType],
      }));

    setFilteredData(processedData);
  }, [rawData, dataType, timeRange]); // ✅ included rawData as dependency

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        title: { display: true, text: "Time" },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: dataType.charAt(0).toUpperCase() + dataType.slice(1),
        },
      },
    },
  };

  const graphData = {
    labels: filteredData.map((entry) => entry.x),
    datasets: [
      {
        label: dataType.charAt(0).toUpperCase() + dataType.slice(1),
        data: filteredData.map((entry) => entry.y),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Pond Data for {pondName}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="data-type-label">Data Type</InputLabel>
          <Select
            labelId="data-type-label"
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
          >
            <MenuItem value="temp">Temperature</MenuItem>
            <MenuItem value="ph">pH</MenuItem>
            <MenuItem value="turbidity">Turbidity</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Button
            variant={timeRange === "today" ? "contained" : "outlined"}
            onClick={() => setTimeRange("today")}
          >
            Today
          </Button>
          <Button
            variant={timeRange === "week" ? "contained" : "outlined"}
            onClick={() => setTimeRange("week")}
          >
            Last Week
          </Button>
          <Button
            variant={timeRange === "month" ? "contained" : "outlined"}
            onClick={() => setTimeRange("month")}
          >
            Last Month
          </Button>
          <Button
            variant={timeRange === "all" ? "contained" : "outlined"}
            onClick={() => setTimeRange("all")}
          >
            All Time
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 400 }}>
        <Line data={graphData} options={graphOptions} />
      </Box>
    </Box>
  );
};

export default FishDetails;
