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

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);

  const subscriptions = [
    {
      id: 1,
      subscriber_id: 101,
      subscriber_name: "John Doe",
      package_id: 1,
      start_date: "2023-09-01",
      end_date: "2023-09-30",
      status: "Active",
      payment_status: "Paid",
    },
    {
      id: 2,
      subscriber_id: 102,
      subscriber_name: "Jane Smith",
      package_id: 2,
      start_date: "2023-08-01",
      end_date: "2023-08-31",
      status: "Expired",
      payment_status: "Paid",
    },
    {
      id: 3,
      subscriber_id: 103,
      subscriber_name: "Alice Johnson",
      package_id: 3,
      start_date: "2023-09-15",
      end_date: "2023-10-14",
      status: "Active",
      payment_status: "Pending",
    },
  ];

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
        ? subscription.subscriber_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true
    )
    .filter((subscription) =>
      statusFilter === "All" ? true : subscription.status === statusFilter
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
        <Typography variant="h4">Subscriptions</Typography>
        <TextField
          label="Search by Subscriber Name"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "800px" }}
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
          <MenuItem onClick={() => handleStatusFilterClose("Active")}>
            Active
          </MenuItem>
          <MenuItem onClick={() => handleStatusFilterClose("Expired")}>
            Expired
          </MenuItem>
        </Menu>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Subscriber ID</TableCell>
              <TableCell>Subscriber Name</TableCell>
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
                <TableCell>{subscription.subscriber_name}</TableCell>
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