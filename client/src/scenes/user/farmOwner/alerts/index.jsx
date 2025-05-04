import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Latest to Oldest");
  const [severityAnchorEl, setSeverityAnchorEl] = useState(null);
  const [dateAnchorEl, setDateAnchorEl] = useState(null);

  // Fetch alerts from backend
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/latest-alerts");
        setAlerts(response.data.alerts);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };

    fetchAlerts();

    // Optional: auto-refresh every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSeverityFilterClick = (event) => {
    setSeverityAnchorEl(event.currentTarget);
  };

  const handleSeverityFilterClose = (filter) => {
    if (filter) setSeverityFilter(filter);
    setSeverityAnchorEl(null);
  };

  const handleDateFilterClick = (event) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleDateFilterClose = (filter) => {
    if (filter) setDateFilter(filter);
    setDateAnchorEl(null);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prev) =>
      prev === "Latest to Oldest" ? "Oldest to Latest" : "Latest to Oldest"
    );
  };

  const filteredAlerts = alerts
    .filter((alert) =>
      severityFilter === "All" ? true : alert.severity === severityFilter
    )
    .filter((alert) => {
      if (dateFilter === "All") return true;

      const now = new Date();
      const alertDate = new Date(alert.timestamp);

      if (dateFilter === "Today") {
        return alertDate.toDateString() === now.toDateString();
      } else if (dateFilter === "Last Week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return alertDate >= oneWeekAgo && alertDate <= now;
      } else if (dateFilter === "Last Month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return alertDate >= oneMonthAgo && alertDate <= now;
      }
      return false;
    })
    .sort((a, b) => {
      if (sortOrder === "Latest to Oldest") {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
    });

  const getSeverityColor = (severity) => {
    if (severity === "High") return "red";
    if (severity === "Moderate") return "orange";
    if (severity === "Low") return "yellow";
    return "inherit";
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Alerts</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSeverityFilterClick}
            sx={{ mr: 2 }}
          >
            Filter by Severity: {severityFilter}
          </Button>
          <Menu
            anchorEl={severityAnchorEl}
            open={Boolean(severityAnchorEl)}
            onClose={() => handleSeverityFilterClose(null)}
          >
            <MenuItem onClick={() => handleSeverityFilterClose("All")}>All</MenuItem>
            <MenuItem onClick={() => handleSeverityFilterClose("High")}>High</MenuItem>
            <MenuItem onClick={() => handleSeverityFilterClose("Moderate")}>Moderate</MenuItem>
            <MenuItem onClick={() => handleSeverityFilterClose("Low")}>Low</MenuItem>
          </Menu>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleDateFilterClick}
            sx={{ mr: 2 }}
          >
            Filter by Date: {dateFilter}
          </Button>
          <Menu
            anchorEl={dateAnchorEl}
            open={Boolean(dateAnchorEl)}
            onClose={() => handleDateFilterClose(null)}
          >
            <MenuItem onClick={() => handleDateFilterClose("All")}>All Time</MenuItem>
            <MenuItem onClick={() => handleDateFilterClose("Today")}>Today</MenuItem>
            <MenuItem onClick={() => handleDateFilterClose("Last Week")}>Last Week</MenuItem>
            <MenuItem onClick={() => handleDateFilterClose("Last Month")}>Last Month</MenuItem>
          </Menu>

          <Button
            variant="contained"
            color="info"
            onClick={handleSortOrderChange}
          >
            Sort: {sortOrder}
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Pond ID</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAlerts.map((alert, index) => (
              <TableRow key={`${alert.pond_id}-${alert.timestamp}`}>
                <TableCell sx={{ fontSize: "1.1rem" }}>{index + 1}</TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>{alert.pond_id}</TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>{alert.message}</TableCell>
                <TableCell
                  sx={{
                    color: getSeverityColor(alert.severity),
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  {alert.severity}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {new Date(alert.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Alerts;
