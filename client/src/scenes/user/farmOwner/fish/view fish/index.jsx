import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Fish = () => {
  const navigate = useNavigate();
  const [fishStocks, setFishStocks] = useState([]);
  const [fishSpecies, setFishSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFish, setSelectedFish] = useState(null);
  const [updatedQuantity, setUpdatedQuantity] = useState("");
  const [updatedSpeciesId, setUpdatedSpeciesId] = useState("");

  useEffect(() => {
    const fetchFishStocks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Unauthorized! Please login again.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/owner/get-all-fish-stockings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFishStocks(response.data);
      } catch (error) {
        console.error("Error fetching fish stocks:", error);
        alert("❌ Failed to fetch fish stocks.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFishSpecies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/owner/get-all-fish",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFishSpecies(response.data);
      } catch (error) {
        console.error("Error fetching fish species:", error);
      }
    };

    fetchFishStocks();
    fetchFishSpecies();
  }, [navigate]);

  const handleDelete = async (stockId) => {
    if (!window.confirm("Are you sure you want to delete this fish stock?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/owner/delete-fish-stock/${stockId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFishStocks(prev => prev.filter(fish => fish.id !== stockId));
      alert("✅ Fish stock deleted successfully.");
    } catch (error) {
      console.error("Error deleting fish stock:", error);
      alert("❌ Failed to delete fish stock.");
    }
  };

  const openEditModal = (fish) => {
    setSelectedFish(fish);
    setUpdatedQuantity(fish.quantity);
    setUpdatedSpeciesId(fish.fish_id); // NOTE: you must return fish_id in your GET API
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/owner/update-fish-stock/${selectedFish.id}`,
        {
          quantity: updatedQuantity,
          fish_id: updatedSpeciesId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Find the updated species name from the species list
      const selectedSpeciesObj = fishSpecies.find(species => species.id === updatedSpeciesId);
  
      setFishStocks(prev =>
        prev.map(fish =>
          fish.id === selectedFish.id
            ? {
                ...fish,
                quantity: updatedQuantity,
                fish_id: updatedSpeciesId,
                fish_species: selectedSpeciesObj ? selectedSpeciesObj.species : fish.fish_species,
              }
            : fish
        )
      );
      setEditModalOpen(false);
      alert("✅ Fish stock updated successfully.");
    } catch (error) {
      console.error("Error updating fish stock:", error);
      alert("❌ Failed to update fish stock.");
    }
  };
  

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Fish Stocks</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/addfish")}
        >
          Add New Fish Stock
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Pond Name</TableCell>
              <TableCell>Fish Species</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Date of Stocking</TableCell>
              <TableCell>Age at Stocking</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>View Stats</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fishStocks.map((fish) => (
              <TableRow key={fish.id}>
                <TableCell>{fish.id}</TableCell>
                <TableCell>{fish.pond_name}</TableCell>
                <TableCell>{fish.fish_species}</TableCell>
                <TableCell>{fish.quantity}</TableCell>
                <TableCell>{new Date(fish.date_of_stocking).toLocaleDateString()}</TableCell>
                <TableCell>{fish.age_at_stocking}</TableCell>
                <TableCell>
                  <Button onClick={() => openEditModal(fish)}>
                    <Edit />
                  </Button>
                  <Button
                    onClick={() => handleDelete(fish.id)}
                    sx={{ color: "red" }}
                  >
                    <Delete />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/fish/fish-details")}
                  >
                    View Stats
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Fish Stock</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Fish Species</InputLabel>
            <Select
              value={updatedSpeciesId}
              label="Fish Species"
              onChange={(e) => setUpdatedSpeciesId(e.target.value)}
            >
              {fishSpecies.map((species) => (
                <MenuItem key={species.id} value={species.id}>
                  {species.species}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            margin="normal"
            value={updatedQuantity}
            onChange={(e) => setUpdatedQuantity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Fish;
