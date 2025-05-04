import React, { useEffect, useState } from "react";
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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedSeverities, setSelectedSeverities] = useState([]);
  const [selectedPondIds, setSelectedPondIds] = useState([]);
  const [dateFilter, setDateFilter] = useState("All");
  const [severityAnchorEl, setSeverityAnchorEl] = useState(null);
  const [pondAnchorEl, setPondAnchorEl] = useState(null);
  const [dateAnchorEl, setDateAnchorEl] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/latest-alerts");
        const formatted = res.data.alerts.map((alert, index) => {
          const ts = new Date(alert.timestamp);
          return {
            id: index + 1,
            pond_id: alert.pond_id,
            message: alert.message,
            severity: alert.severity,
            date: ts.toISOString().split("T")[0],
            time: ts.toTimeString().split(" ")[0].slice(0, 5),
          };
        });
        setAlerts(formatted);
      } catch (err) {
        console.error("Error fetching alerts:", err);
      }
    };
    fetchAlerts();
  }, []);

  const handleSeverityChange = (event) => {
    const { value, checked } = event.target;
    if (value === "All") {
      setSelectedSeverities(checked ? ["Severe", "High", "Moderate"] : []);
    } else {
      setSelectedSeverities((prev) =>
        checked ? [...prev, value] : prev.filter((s) => s !== value)
      );
    }
  };

  const handlePondChange = (event) => {
    const { value, checked } = event.target;
    if (value === "All") {
      const allIds = [...new Set(alerts.map((a) => a.pond_id))];
      setSelectedPondIds(checked ? allIds : []);
    } else {
      setSelectedPondIds((prev) =>
        checked ? [...prev, Number(value)] : prev.filter((id) => id !== Number(value))
      );
    }
  };

  const isAllSeveritiesSelected = selectedSeverities.length === 3;
  const allPondIds = [...new Set(alerts.map((a) => a.pond_id))];
  const isAllPondsSelected = selectedPondIds.length === allPondIds.length;

  const filterBySeverity = (data) =>
    selectedSeverities.length === 0
      ? data
      : data.filter((a) => selectedSeverities.includes(a.severity));

  const filterByPondId = (data) =>
    selectedPondIds.length === 0
      ? data
      : data.filter((a) => selectedPondIds.includes(a.pond_id));

  const filterByDate = (data) => {
    if (dateFilter === "All") return data;
    const now = new Date();
    return data.filter((a) => {
      const date = new Date(`${a.date}T${a.time}`);
      if (dateFilter === "Today") {
        return date.toDateString() === now.toDateString();
      } else if (dateFilter === "Last Week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return date >= oneWeekAgo && date <= now;
      } else if (dateFilter === "Last Month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return date >= oneMonthAgo && date <= now;
      }
      return false;
    });
  };

  const filteredAlerts = filterByDate(filterByPondId(filterBySeverity(alerts)));

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Alerts</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => setSeverityAnchorEl(e.currentTarget)}
            sx={{ mr: 2 }}
          >
            Filter by Severity
          </Button>
          <Menu
            anchorEl={severityAnchorEl}
            open={Boolean(severityAnchorEl)}
            onClose={() => setSeverityAnchorEl(null)}
          >
            <FormGroup sx={{ p: 2 }}>
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
              {["Severe", "High", "Moderate"].map((s) => (
                <FormControlLabel
                  key={s}
                  control={
                    <Checkbox
                      value={s}
                      checked={selectedSeverities.includes(s)}
                      onChange={handleSeverityChange}
                    />
                  }
                  label={s}
                />
              ))}
            </FormGroup>
          </Menu>

          <Button
            variant="contained"
            color="primary"
            onClick={(e) => setPondAnchorEl(e.currentTarget)}
            sx={{ mr: 2 }}
          >
            Filter by Pond
          </Button>
          <Menu
            anchorEl={pondAnchorEl}
            open={Boolean(pondAnchorEl)}
            onClose={() => setPondAnchorEl(null)}
          >
            <FormGroup sx={{ p: 2 }}>
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
              {allPondIds.map((id) => (
                <FormControlLabel
                  key={id}
                  control={
                    <Checkbox
                      value={id}
                      checked={selectedPondIds.includes(id)}
                      onChange={handlePondChange}
                    />
                  }
                  label={`Pond ${id}`}
                />
              ))}
            </FormGroup>
          </Menu>

          <Button
            variant="contained"
            color="secondary"
            onClick={(e) => setDateAnchorEl(e.currentTarget)}
          >
            Filter by Date: {dateFilter}
          </Button>
          <Menu
            anchorEl={dateAnchorEl}
            open={Boolean(dateAnchorEl)}
            onClose={() => setDateAnchorEl(null)}
          >
            {["All", "Today", "Last Week", "Last Month"].map((filter) => (
              <MenuItem
                key={filter}
                onClick={() => {
                  setDateFilter(filter);
                  setDateAnchorEl(null);
                }}
              >
                {filter}
              </MenuItem>
            ))}
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
            {filteredAlerts.map((a) => (
              <TableRow key={`${a.pond_id}-${a.date}-${a.time}`}>
                <TableCell>{a.id}</TableCell>
                <TableCell>{a.pond_id}</TableCell>
                <TableCell>{a.message}</TableCell>
                <TableCell>{a.severity}</TableCell>
                <TableCell>{a.date}</TableCell>
                <TableCell>{a.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Alerts;
