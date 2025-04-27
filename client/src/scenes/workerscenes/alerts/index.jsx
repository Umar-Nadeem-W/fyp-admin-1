import React, { useState } from "react";
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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const Alerts = () => {
  const [selectedSeverities, setSelectedSeverities] = useState([]);
  const [selectedPondIds, setSelectedPondIds] = useState([]);
  const [dateFilter, setDateFilter] = useState("All");
  const [severityAnchorEl, setSeverityAnchorEl] = useState(null);
  const [pondAnchorEl, setPondAnchorEl] = useState(null);
  const [dateAnchorEl, setDateAnchorEl] = useState(null);

  const alerts = [
    {
      id: 1,
      pond_id: 101,
      message: "High Temperature",
      severity: "Severe",
      date: "2023-10-01",
      time: "14:30",
    },
    {
      id: 2,
      pond_id: 102,
      message: "Low pH",
      severity: "High",
      date: "2023-09-25",
      time: "10:15",
    },
    {
      id: 3,
      pond_id: 103,
      message: "Moderate Turbidity",
      severity: "Moderate",
      date: "2023-09-20",
      time: "08:45",
    },
  ];

  const handleSeverityChange = (event) => {
    const { value, checked } = event.target;
    if (value === "All") {
      setSelectedSeverities(checked ? ["Severe", "High", "Moderate"] : []);
    } else {
      setSelectedSeverities((prev) =>
        checked ? [...prev, value] : prev.filter((severity) => severity !== value)
      );
    }
  };

  const handlePondChange = (event) => {
    const { value, checked } = event.target;
    if (value === "All") {
      const allPondIds = [...new Set(alerts.map((alert) => alert.pond_id))];
      setSelectedPondIds(checked ? allPondIds : []);
    } else {
      setSelectedPondIds((prev) =>
        checked ? [...prev, Number(value)] : prev.filter((id) => id !== Number(value))
      );
    }
  };

  const isAllSeveritiesSelected = selectedSeverities.length === 3;
  const allPondIds = [...new Set(alerts.map((alert) => alert.pond_id))];
  const isAllPondsSelected = selectedPondIds.length === allPondIds.length;

  const filterBySeverity = (alerts) =>
    selectedSeverities.length === 0
      ? alerts
      : alerts.filter((alert) => selectedSeverities.includes(alert.severity));

  const filterByPondId = (alerts) =>
    selectedPondIds.length === 0
      ? alerts
      : alerts.filter((alert) => selectedPondIds.includes(alert.pond_id));

  const filterByDate = (alerts) => {
    if (dateFilter === "All") return alerts;

    const now = new Date();
    return alerts.filter((alert) => {
      const alertDate = new Date(alert.date);
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
    });
  };

  const filteredAlerts = filterByDate(filterByPondId(filterBySeverity(alerts)));

  const handleSeverityFilterClick = (event) => {
    setSeverityAnchorEl(event.currentTarget);
  };

  const handleSeverityFilterClose = () => {
    setSeverityAnchorEl(null);
  };

  const handlePondFilterClick = (event) => {
    setPondAnchorEl(event.currentTarget);
  };

  const handlePondFilterClose = () => {
    setPondAnchorEl(null);
  };

  const handleDateFilterClick = (event) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleDateFilterClose = (filter) => {
    if (filter) setDateFilter(filter);
    setDateAnchorEl(null);
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
            Filter by Severity
          </Button>
          <Menu
            anchorEl={severityAnchorEl}
            open={Boolean(severityAnchorEl)}
            onClose={handleSeverityFilterClose}
          >
            <FormGroup sx={{ padding: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="All"
                    checked={isAllSeveritiesSelected}
                    onChange={handleSeverityChange}
                  />
                }
                label="All"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="Severe"
                    checked={selectedSeverities.includes("Severe")}
                    onChange={handleSeverityChange}
                  />
                }
                label="Severe"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="High"
                    checked={selectedSeverities.includes("High")}
                    onChange={handleSeverityChange}
                  />
                }
                label="High"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="Moderate"
                    checked={selectedSeverities.includes("Moderate")}
                    onChange={handleSeverityChange}
                  />
                }
                label="Moderate"
              />
            </FormGroup>
          </Menu>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePondFilterClick}
            sx={{ mr: 2 }}
          >
            Filter by Pond
          </Button>
          <Menu
            anchorEl={pondAnchorEl}
            open={Boolean(pondAnchorEl)}
            onClose={handlePondFilterClose}
          >
            <FormGroup sx={{ padding: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="All"
                    checked={isAllPondsSelected}
                    onChange={handlePondChange}
                  />
                }
                label="All"
              />
              {allPondIds.map((pondId) => (
                <FormControlLabel
                  key={pondId}
                  control={
                    <Checkbox
                      value={pondId}
                      checked={selectedPondIds.includes(pondId)}
                      onChange={handlePondChange}
                    />
                  }
                  label={`Pond ${pondId}`}
                />
              ))}
            </FormGroup>
          </Menu>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDateFilterClick}
          >
            Filter by Date: {dateFilter}
          </Button>
          <Menu
            anchorEl={dateAnchorEl}
            open={Boolean(dateAnchorEl)}
            onClose={() => handleDateFilterClose(null)}
          >
            <MenuItem onClick={() => handleDateFilterClose("All")}>
              All
            </MenuItem>
            <MenuItem onClick={() => handleDateFilterClose("Today")}>
              Today
            </MenuItem>
            <MenuItem onClick={() => handleDateFilterClose("Last Week")}>
              Last Week
            </MenuItem>
            <MenuItem onClick={() => handleDateFilterClose("Last Month")}>
              Last Month
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Pond ID</TableCell>
              <TableCell>Alert Message</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAlerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{alert.id}</TableCell>
                <TableCell>{alert.pond_id}</TableCell>
                <TableCell>{alert.message}</TableCell>
                <TableCell>{alert.severity}</TableCell>
                <TableCell>{alert.date}</TableCell>
                <TableCell>{alert.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Alerts;