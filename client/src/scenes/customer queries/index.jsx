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
  TextField,
} from "@mui/material";

const CustomerQueries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [queries, setQueries] = useState([
    {
      id: 1,
      user_id: 101,
      farm_id: 201,
      email: "user1@example.com",
      username: "User One",
      date: "2023-10-01",
      status: "Pending",
    },
    {
      id: 2,
      user_id: 102,
      farm_id: 202,
      email: "user2@example.com",
      username: "User Two",
      date: "2023-09-25",
      status: "Handled",
    },
    {
      id: 3,
      user_id: 103,
      farm_id: 203,
      email: "user3@example.com",
      username: "User Three",
      date: "2023-09-20",
      status: "Pending",
    },
  ]);

  const handleDateFilterClick = (event) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleDateFilterClose = (filter) => {
    if (filter) setDateFilter(filter);
    setDateAnchorEl(null);
  };

  const handleStatusFilterClick = (event) => {
    setStatusAnchorEl(event.currentTarget);
  };

  const handleStatusFilterClose = (filter) => {
    if (filter) setStatusFilter(filter);
    setStatusAnchorEl(null);
  };

  const markAsHandled = (id) => {
    setQueries((prevQueries) =>
      prevQueries.map((query) =>
        query.id === id ? { ...query, status: "Handled" } : query
      )
    );
  };

  const filteredQueries = queries
    .filter((query) =>
      searchQuery
        ? query.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          query.email.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .filter((query) => {
      if (dateFilter === "All") return true;

      const now = new Date();
      const queryDate = new Date(query.date);

      if (dateFilter === "Today") {
        return queryDate.toDateString() === now.toDateString();
      } else if (dateFilter === "Last Week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return queryDate >= oneWeekAgo && queryDate <= now;
      } else if (dateFilter === "Last Month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return queryDate >= oneMonthAgo && queryDate <= now;
      }
      return false;
    })
    .filter((query) =>
      statusFilter === "All" ? true : query.status === statusFilter
    );

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
        <Typography variant="h4">Customer Queries</Typography>
        <TextField
          label="Search by Username/Email"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "600px" }}
        />
        <Box>
          <Button
            variant="contained"
            color="primary"
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
            <MenuItem onClick={() => handleDateFilterClose("All")}>All</MenuItem>
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
          <Button
            variant="contained"
            color="secondary"
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
            <MenuItem onClick={() => handleStatusFilterClose("Pending")}>
              Pending
            </MenuItem>
            <MenuItem onClick={() => handleStatusFilterClose("Handled")}>
              Handled
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Query ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Farm ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQueries.map((query) => (
              <TableRow key={query.id}>
                <TableCell>{query.id}</TableCell>
                <TableCell>{query.user_id}</TableCell>
                <TableCell>{query.farm_id}</TableCell>
                <TableCell>{query.email}</TableCell>
                <TableCell>{query.username}</TableCell>
                <TableCell>{query.date}</TableCell>
                <TableCell>{query.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.open(`mailto:${query.email}`)}
                    sx={{ mr: 1 }}
                  >
                    Read
                  </Button>
                  {query.status === "Pending" && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => markAsHandled(query.id)}
                    >
                      Mark as Handled
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomerQueries;