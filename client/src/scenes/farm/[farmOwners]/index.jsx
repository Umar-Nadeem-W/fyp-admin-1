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
  MenuItem,
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

const initialOwnerState = {
  name: "",
  user_id: "",
  number_of_farms: "",
  status: "Active",
};

const FarmOwnerManagement = () => {
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [ownerData, setOwnerData] = useState(initialOwnerState);
  const [viewOwner, setViewOwner] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/farm_owners");
      setOwners(response.data);
    } catch (error) {
      console.error("Error fetching farm owners:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedOwner) {
        await axios.put(`http://localhost:5000/api/farm_owners/${selectedOwner}`, ownerData);
      } else {
        await axios.post("http://localhost:5000/api/farm_owners", ownerData);
      }
      fetchOwners();
      resetForm();
    } catch (error) {
      console.error("Error saving farm owner:", error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setSelectedOwner(null);
    setOwnerData(initialOwnerState);
  };

  const handleView = (owner) => {
    setViewOwner(owner);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/farm_owners/${id}`);
      fetchOwners();
    } catch (error) {
      console.error("Error deleting farm owner:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOwnerData({ ...ownerData, [name]: value });
  };

  return (
    <Box p={isSmallScreen ? 2 : 4}>
      <Typography variant="h4" gutterBottom>
        Farm Owner Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          setShowForm(true);
          setSelectedOwner(null);
          setOwnerData(initialOwnerState);
        }}
        sx={{ mb: 3 }}
      >
        Add Farm Owner
      </Button>

      {showForm && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {selectedOwner ? "Edit Farm Owner" : "Add New Farm Owner"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                { label: "Full Name", name: "name" },
                { label: "User ID", name: "user_id", type: "number" },
                { label: "Number of Farms", name: "number_of_farms", type: "number" },
              ].map(({ label, name, type = "text" }) => (
                <Grid item xs={12} sm={6} key={name}>
                  <TextField
                    fullWidth
                    label={label}
                    name={name}
                    value={ownerData[name]}
                    onChange={handleChange}
                    required
                    type={type}
                  />
                </Grid>
              ))}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={ownerData.status}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Box mt={3}>
              <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                {selectedOwner ? "Update" : "Create"}
              </Button>
              <Button onClick={resetForm} variant="outlined" color="secondary">
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Typography variant="h5" gutterBottom>
        All Farm Owners
      </Typography>

      {owners.length ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Owner Name</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Farms</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Registered</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {owners.map((owner) => (
                <TableRow key={owner.id} hover>
                  <TableCell>{owner.id}</TableCell>
                  <TableCell>{owner.owner_name}</TableCell>
                  <TableCell>{owner.user_id}</TableCell>
                  <TableCell>{owner.number_of_farms}</TableCell>
                  <TableCell>{owner.status}</TableCell>
                  <TableCell>
                    {owner.registration_date
                      ? new Date(owner.registration_date).toLocaleString()
                      : "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleView(owner)}>
                      <Visibility />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedOwner(owner.id);
                        setOwnerData({
                          name: owner.owner_name,
                          user_id: owner.user_id,
                          number_of_farms: owner.number_of_farms,
                          status: owner.status,
                        });
                        setShowForm(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(owner.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography mt={2}>No farm owners available.</Typography>
      )}

      <Dialog open={!!viewOwner} onClose={() => setViewOwner(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Farm Owner Details</DialogTitle>
        <DialogContent dividers>
          {viewOwner && (
            <List>
              <ListItem>
                <ListItemText primary="ID" secondary={viewOwner.id} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Name" secondary={viewOwner.owner_name} />
              </ListItem>
              <ListItem>
                <ListItemText primary="User ID" secondary={viewOwner.user_id} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Number of Farms" secondary={viewOwner.number_of_farms} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Status" secondary={viewOwner.status} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Registration Date"
                  secondary={
                    viewOwner.registration_date
                      ? new Date(viewOwner.registration_date).toLocaleString()
                      : "N/A"
                  }
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOwner(null)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FarmOwnerManagement;
