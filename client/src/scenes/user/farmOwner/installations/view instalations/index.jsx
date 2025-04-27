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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Installations = () => {
  const navigate = useNavigate();
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstallation, setSelectedInstallation] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const fetchInstallations = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:5000/api/owner/get-installations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInstallations(response.data);
    } catch (error) {
      console.error("Error fetching installations:", error.response?.data || error.message);
      alert("❌ Failed to load installations.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (installation) => {
    setSelectedInstallation(installation);
    setNotes(installation.notes || "");
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/owner/update-installation/${selectedInstallation.id}`,
        { notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditDialogOpen(false);
      setSelectedInstallation(null);
      fetchInstallations();
    } catch (error) {
      console.error("Error updating installation:", error.response?.data || error.message);
      alert("❌ Failed to update installation.");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:5000/api/owner/delete-installation/${selectedInstallation.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeleteDialogOpen(false);
      setSelectedInstallation(null);
      fetchInstallations();
    } catch (error) {
      console.error("Error deleting installation:", error.response?.data || error.message);
      alert("❌ Failed to delete installation.");
    }
  };

  useEffect(() => {
    fetchInstallations();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Installations</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/addinstallations")}>
          Add New Installation
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Device</TableCell>
                <TableCell>Pond</TableCell>
                <TableCell>Installation Date</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {installations.map((installation) => (
                <TableRow key={installation.id}>
                  <TableCell>{installation.id}</TableCell>
                  <TableCell>{installation.device_name || installation.device_id}</TableCell>
                  <TableCell>{installation.pond_name || installation.pond_id}</TableCell>
                  <TableCell>{installation.installation_date}</TableCell>
                  <TableCell>{installation.notes}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(installation)}>
                      <Edit />
                    </Button>
                    <Button
                      sx={{ color: "red" }}
                      onClick={() => {
                        setSelectedInstallation(installation);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Delete />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Installation Notes</DialogTitle>
        <DialogContent>
          <TextField
            label="Notes"
            fullWidth
            multiline
            minRows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete installation{" "}
          <strong>#{selectedInstallation?.id}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Installations;
