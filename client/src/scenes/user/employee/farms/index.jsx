import React, { useEffect, useState } from "react";
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

const Farms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [workersFilter, setWorkersFilter] = useState("All");
  const [cityAnchorEl, setCityAnchorEl] = useState(null);
  const [workersAnchorEl, setWorkersAnchorEl] = useState(null);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFarms = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored
      const response = await fetch('http://localhost:5000/api/employee/get-farms', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFarms(data.farms || []);
    } catch (error) {
      console.error("Error fetching farms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleCityFilterClick = (event) => {
    setCityAnchorEl(event.currentTarget);
  };

  const handleCityFilterClose = (filter) => {
    if (filter) setCityFilter(filter);
    setCityAnchorEl(null);
  };

  const handleWorkersFilterClick = (event) => {
    setWorkersAnchorEl(event.currentTarget);
  };

  const handleWorkersFilterClose = (filter) => {
    if (filter) setWorkersFilter(filter);
    setWorkersAnchorEl(null);
  };

  const filteredFarms = farms
    .filter((farm) =>
      searchQuery
        ? farm.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .filter((farm) =>
      cityFilter === "All" ? true : farm.city === cityFilter
    )
    .filter((farm) => {
      if (workersFilter === "All") return true;
      if (workersFilter === "Greater than 25") return farm.number_of_workers > 25;
      if (workersFilter === "Less than 25") return farm.number_of_workers <= 25;
      return true;
    });

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
        }}
      >
        <Typography variant="h4">Farms</Typography>
        <TextField
          label="Search by Farm Name"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "800px" }}
        />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCityFilterClick}
            sx={{ mr: 2 }}
          >
            Filter by City: {cityFilter}
          </Button>
          <Menu
            anchorEl={cityAnchorEl}
            open={Boolean(cityAnchorEl)}
            onClose={() => handleCityFilterClose(null)}
          >
            <MenuItem onClick={() => handleCityFilterClose("All")}>All</MenuItem>
            {[...new Set(farms.map((farm) => farm.city))].map((city) => (
              <MenuItem key={city} onClick={() => handleCityFilterClose(city)}>
                {city}
              </MenuItem>
            ))}
          </Menu>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleWorkersFilterClick}
          >
            Filter by Workers: {workersFilter}
          </Button>
          <Menu
            anchorEl={workersAnchorEl}
            open={Boolean(workersAnchorEl)}
            onClose={() => handleWorkersFilterClose(null)}
          >
            <MenuItem onClick={() => handleWorkersFilterClose("All")}>
              All
            </MenuItem>
            <MenuItem onClick={() => handleWorkersFilterClose("Greater than 25")}>
              Greater than 25
            </MenuItem>
            <MenuItem onClick={() => handleWorkersFilterClose("Less than 25")}>
              Less than 25
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Farm ID</TableCell>
              <TableCell>Owner ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>ZIP</TableCell>
              <TableCell>Number of Ponds</TableCell>
              <TableCell>Number of Workers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFarms.map((farm) => (
              <TableRow key={farm.id}>
                <TableCell>{farm.id}</TableCell>
                <TableCell>{farm.owner_id}</TableCell>
                <TableCell>{farm.name}</TableCell>
                <TableCell>{farm.address}</TableCell>
                <TableCell>{farm.city}</TableCell>
                <TableCell>{farm.state}</TableCell>
                <TableCell>{farm.country}</TableCell>
                <TableCell>{farm.zip}</TableCell>
                <TableCell>{farm.number_of_ponds}</TableCell>
                <TableCell>{farm.number_of_workers}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Farms;
