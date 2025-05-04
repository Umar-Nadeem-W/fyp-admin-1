import React, { useState, useEffect } from "react";
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
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!token) {
        alert("Missing token.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/employee/get-subscriptions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error.response?.data || error.message);
        alert("❌ Error fetching subscriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [token]);

  const handleStatusFilterClick = (event) => {
    setStatusAnchorEl(event.currentTarget);
  };

  const handleStatusFilterClose = (filter) => {
    if (filter) setStatusFilter(filter);
    setStatusAnchorEl(null);
  };

  const filteredSubscriptions = subscriptions
    .filter((subscription) =>
      searchQuery
        ? (subscription.subscriber_name || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true
    )
    .filter((subscription) =>
      statusFilter === "All" ? true : subscription.status === statusFilter
    );

  if (loading) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4">All Subscriptions</Typography>
        <TextField
          label="Search by Subscriber Name"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: "250px", flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleStatusFilterClick}
        >
          Filter by Status: {statusFilter}
        </Button>
        <Menu
          anchorEl={statusAnchorEl}
          open={Boolean(statusAnchorEl)}
          onClose={() => handleStatusFilterClose(null)}
        >
          <MenuItem onClick={() => handleStatusFilterClose("All")}>All</MenuItem>
          <MenuItem onClick={() => handleStatusFilterClose("Active")}>Active</MenuItem>
          <MenuItem onClick={() => handleStatusFilterClose("Expired")}>Expired</MenuItem>
        </Menu>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Subscriber ID</TableCell>
              <TableCell>Package ID</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.id}</TableCell>
                <TableCell>{subscription.subscriber_id}</TableCell>
                <TableCell>{subscription.package_id}</TableCell>
                <TableCell>{subscription.start_date}</TableCell>
                <TableCell>{subscription.end_date}</TableCell>
                <TableCell>{subscription.status}</TableCell>
                <TableCell>{subscription.payment_status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Subscriptions;
