import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewPond = () => {
  const [ponds, setPonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    length: "",
    width: "",
    depth: "",
  });

  const token = localStorage.getItem("token");
  const farmId = localStorage.getItem("farmId");
  const navigate = useNavigate();

  const fetchPonds = async () => {
    if (!token || !farmId) {
      alert("User not authenticated or farm not selected.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/owner/get-ponds-by-farm/${farmId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPonds(response.data);
    } catch (error) {
      console.error("Error fetching ponds:", error.response?.data || error.message);
      alert("❌ Failed to fetch ponds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPonds();
  }, [token, farmId]);

  const handleEditClick = (pond) => {
    setSelectedPond(pond);
    setFormData({
      name: pond.name,
      type: pond.type,
      length: pond.length,
      width: pond.width,
      depth: pond.depth,
    });
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/owner/edit-pond/${selectedPond.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Pond updated successfully");
      setOpenEdit(false);
      fetchPonds();
    } catch (error) {
      console.error("Edit failed:", error.response?.data || error.message);
      alert("❌ Failed to update pond");
    }
  };

  const handleDelete = async (pondId) => {
    if (!window.confirm("Are you sure you want to delete this pond?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/owner/delete-pond/${pondId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("🗑️ Pond deleted successfully");
      fetchPonds();
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
      alert("❌ Failed to delete pond");
    }
  };

  if (loading) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ponds.length) {
    return <Typography sx={{ padding: 3 }}>No ponds found</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        All Ponds
      </Typography>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Farm ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Length</TableCell>
              <TableCell>Width</TableCell>
              <TableCell>Depth</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ponds.map((pond) => (
              <TableRow key={pond.id}>
                <TableCell>{pond.id}</TableCell>
                <TableCell>{pond.farm_id}</TableCell>
                <TableCell>{pond.name}</TableCell>
                <TableCell>{pond.type}</TableCell>
                <TableCell>{pond.length}</TableCell>
                <TableCell>{pond.width}</TableCell>
                <TableCell>{pond.depth}</TableCell>
                <TableCell>{pond.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(pond)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(pond.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Pond</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleEditChange}
            placeholder="Clay or Concrete"
            fullWidth
          />
          <TextField
            label="Length"
            name="length"
            value={formData.length}
            onChange={handleEditChange}
            type="number"
            fullWidth
          />
          <TextField
            label="Width"
            name="width"
            value={formData.width}
            onChange={handleEditChange}
            type="number"
            fullWidth
          />
          <TextField
            label="Depth"
            name="depth"
            value={formData.depth}
            onChange={handleEditChange}
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewPond;
