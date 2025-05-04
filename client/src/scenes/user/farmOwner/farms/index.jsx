import React, { useEffect, useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Modal, TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const navigate = useNavigate();

  const fetchFarms = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token)
      if (!token) throw new Error("No token found.");

      const response = await fetch("http://localhost:5000/api/owner/get-farms", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (Array.isArray(data.farms)) {
        setFarms(data.farms);
      } else {
        throw new Error("API did not return farms array");
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (farmId) => {
    const confirmDelete = window.confirm("Delete this farm?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/owner/delete-farm/${farmId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete farm");
      alert("✅ Farm deleted");
      setFarms((prev) => prev.filter((f) => f.id !== farmId));
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Could not delete farm");
    }
  };

  const handleEdit = (farm) => {
    setSelectedFarm({ ...farm });
    setOpen(true);
  };

  const handleEditChange = (e) => {
    setSelectedFarm({ ...selectedFarm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:5000/api/owner/update-farm/${selectedFarm.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedFarm),
      });

      alert("✅ Farm updated");
      setOpen(false);
      fetchFarms(); // refresh list
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Could not update farm");
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  return (
    <Box m={3}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={() => navigate("/farms/addfarm")}>
          Add Farm
        </Button>
      </Box>

      {error && <Typography color="error" mb={2}>{error}</Typography>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Zip</TableCell>
              <TableCell>Ponds</TableCell>
              <TableCell>Workers</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {farms.length > 0 ? farms.map((farm) => (
              <TableRow key={farm.id}>
                <TableCell>{farm.id}</TableCell>
                <TableCell>{farm.name}</TableCell>
                <TableCell>{farm.address}</TableCell>
                <TableCell>{farm.city}</TableCell>
                <TableCell>{farm.state}</TableCell>
                <TableCell>{farm.country}</TableCell>
                <TableCell>{farm.zip}</TableCell>
                <TableCell>{farm.number_of_ponds}</TableCell>
                <TableCell>{farm.number_of_workers}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(farm)}><Edit /></Button>
                  <Button sx={{ color: "red" }} onClick={() => handleDelete(farm.id)}><Delete /></Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={10} align="center">No farms available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>Edit Farm</Typography>
          {selectedFarm && (
            <form onSubmit={handleEditSubmit}>
              {["name", "address", "city", "state", "country", "zip"].map((field) => (
                <TextField
                  key={field}
                  label={field.toUpperCase()}
                  name={field}
                  value={selectedFarm[field]}
                  onChange={handleEditChange}
                  fullWidth
                  margin="normal"
                />
              ))}
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" color="primary">Update</Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Farms;
