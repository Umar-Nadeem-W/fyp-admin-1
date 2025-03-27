import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
  } from "@mui/material";
  
import { Edit, Delete, Visibility, Add } from "@mui/icons-material";
import axios from "axios";

const initialFarmState = {
  name: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zip: "",
  number_of_ponds: "",
  number_of_workers: "",
};

const FarmManagement = () => {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [farmData, setFarmData] = useState(initialFarmState);
  const [viewFarm, setViewFarm] = useState(null); // holds the selected farm for viewing

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/farms");
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  };

  const handleFarmSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedFarm) {
        await axios.put(
          `http://localhost:5000/api/farms/${selectedFarm}`,
          farmData
        );
      } else {
        await axios.post("http://localhost:5000/api/farms", farmData);
      }
      fetchFarms();
      resetForm();
    } catch (error) {
      console.error("Error saving farm:", error);
    }
  };

  const handleViewFarm = (farm) => {
    setViewFarm(farm);
  };

  const resetForm = () => {
    setShowFarmForm(false);
    setSelectedFarm(null);
    setFarmData(initialFarmState);
  };

  const handleDeleteFarm = async (farmId) => {
    try {
      await axios.delete(`http://localhost:5000/api/farms/${farmId}`);
      fetchFarms();
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmData({ ...farmData, [name]: value });
  };

  return (
    <Box p={isSmallScreen ? 2 : 4}>
      <Typography variant="h4" gutterBottom>
        Farm Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          setShowFarmForm(true);
          setSelectedFarm(null);
          setFarmData(initialFarmState);
        }}
        sx={{ mb: 3 }}
      >
        Add Farm
      </Button>

      {showFarmForm && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {selectedFarm ? "Edit Farm" : "Add New Farm"}
          </Typography>
          <Box component="form" onSubmit={handleFarmSubmit}>
            <Grid container spacing={2}>
              {[
                { label: "Farm Name", name: "name" },
                { label: "Address", name: "address" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Country", name: "country" },
                { label: "Zip", name: "zip" },
                {
                  label: "Number Of Ponds",
                  name: "number_of_ponds",
                  type: "number",
                },
                {
                  label: "Number Of Workers",
                  name: "number_of_workers",
                  type: "number",
                },
              ].map(({ label, name, type = "text" }) => (
                <Grid item xs={12} sm={6} key={name}>
                  <TextField
                    fullWidth
                    label={label}
                    name={name}
                    value={farmData[name]}
                    onChange={handleChange}
                    required
                    type={type}
                  />
                </Grid>
              ))}
            </Grid>

            <Box mt={3}>
              <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                {selectedFarm ? "Update" : "Create"}
              </Button>
              <Button onClick={resetForm} variant="outlined" color="secondary">
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Typography variant="h5" gutterBottom>
        All Farms
      </Typography>

      {farms.length ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Farm ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Ponds</TableCell>
                <TableCell>Workers</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {farms.map((farm) => (
                <TableRow key={farm.id} hover>
                  <TableCell>{farm.id}</TableCell>
                  <TableCell>{farm.name}</TableCell>
                  <TableCell>{farm.city}</TableCell>
                  <TableCell>{farm.state}</TableCell>
                  <TableCell>{farm.number_of_ponds}</TableCell>
                  <TableCell>{farm.number_of_workers}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleViewFarm(farm)}>
                    <Visibility />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedFarm(farm.id);
                        setFarmData(farm);
                        setShowFarmForm(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteFarm(farm.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography mt={2}>No farms available.</Typography>
      )}
      <Dialog open={!!viewFarm} onClose={() => setViewFarm(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Farm Details</DialogTitle>
        <DialogContent dividers>
        {viewFarm && (
        <List>
            <ListItem>
              <ListItemText primary="Farm ID" secondary={viewFarm.id} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Name" secondary={viewFarm.name} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Address" secondary={viewFarm.address} />
            </ListItem>
            <ListItem>
              <ListItemText primary="City" secondary={viewFarm.city} />
            </ListItem>
            <ListItem>
              <ListItemText primary="State" secondary={viewFarm.state} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Country" secondary={viewFarm.country} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Zip Code" secondary={viewFarm.zip} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Number of Ponds" secondary={viewFarm.number_of_ponds} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Number of Workers" secondary={viewFarm.number_of_workers} />
            </ListItem>
        </List>
    )}
    </DialogContent>
        <DialogActions>
        <Button onClick={() => setViewFarm(null)} variant="contained" color="primary">
          Close
        </Button>
        </DialogActions>
        </Dialog>
    </Box>
  );
};

export default FarmManagement;
