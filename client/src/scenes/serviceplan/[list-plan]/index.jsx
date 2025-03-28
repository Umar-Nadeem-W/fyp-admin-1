import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import axios from "axios";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ServicePlans = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewPlan, setViewPlan] = useState(null);
  const [editPlan, setEditPlan] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/packages");
      setPackages(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching packages:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await axios.delete(`http://localhost:5000/api/packages/${id}`);
        fetchPackages();
      } catch (err) {
        console.error("Error deleting package:", err);
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/packages/${editData.id}`, editData);
      setEditPlan(null);
      fetchPackages();
    } catch (err) {
      console.error("Error updating package:", err);
    }
  };

  const renderFeature = (label, value) => (
    <Typography
      variant="body2"
      sx={{ display: "flex", alignItems: "center", mb: 1, color: "#E0E0E0" }}
    >
      <CheckCircleIcon fontSize="small" sx={{ color: "#4CAF50", mr: 1 }} />
      {label}: {value ?? "Unlimited"}
    </Typography>
  );

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  // We now support multiple dynamic packages

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        color: "white",
      }}
    >
      <Typography variant="h4" textAlign="center" gutterBottom sx={{ color: "#FFFFFF" }}>
        Choose Your Plan
      </Typography>

      <Grid container spacing={4} justifyContent="center" mt={4}>
        {packages.map((pkg, index) =>
          pkg ? (
            <Grid item xs={12} sm={6} md={4} key={pkg.id}>
              <Card
                sx={{
                  backgroundColor: index === 1 ? "#1B263B" : "#324A5F",
                  color: "white",
                  borderRadius: 4,
                  boxShadow: index === 1
                    ? "0 0 20px rgba(0, 123, 255, 0.4)"
                    : "0 0 10px rgba(255, 255, 255, 0.1)",
                  border: index === 1 ? "2px solid #007BFF" : "1px solid #415A77",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    {index === 1 && <WorkspacePremiumIcon color="primary" />}
                    <Typography variant="h5" fontWeight="bold" color="white">
                      {pkg.name}
                    </Typography>
                  </Box>

                  <Typography variant="body1" gutterBottom sx={{ color: "#B0BEC5" }}>
                    {pkg.description}
                  </Typography>

                  <Divider sx={{ my: 2, backgroundColor: "#607D8B" }} />

                  <Typography variant="h4" gutterBottom sx={{ color: "#00BFA5" }}>
                    ${pkg.price} / {pkg.duration} days
                  </Typography>

                  {renderFeature("Max Sites", pkg.max_sites)}
                  {renderFeature("Max Ponds", pkg.max_ponds)}
                  {renderFeature("Max Workers", pkg.max_workers)}

                  <Stack direction="row" spacing={1} mt={3} justifyContent="center">
                    <IconButton color="primary" onClick={() => setViewPlan(pkg)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => { setEditPlan(pkg); setEditData(pkg); }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(pkg.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ) : null
        )}
      </Grid>

      <Dialog open={!!viewPlan} onClose={() => setViewPlan(null)}>
        <DialogTitle>Plan Details</DialogTitle>
        <DialogContent dividers>
          {viewPlan && Object.entries(viewPlan).map(([key, value]) => (
            <Typography key={key} gutterBottom>
              <strong>{key.replace(/_/g, ' ')}:</strong> {value}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewPlan(null)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editPlan} onClose={() => setEditPlan(null)}>
        <DialogTitle>Edit Plan</DialogTitle>
        <DialogContent dividers>
          {editPlan && Object.keys(initialState).map((key) => (
            <TextField
              key={key}
              margin="dense"
              label={key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              name={key}
              fullWidth
              value={editData[key] || ''}
              onChange={handleEditChange}
              type={["price", "duration", "max_sites", "max_ponds", "max_workers"].includes(key) ? "number" : "text"}
              sx={{ mb: 2 }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPlan(null)} color="secondary">Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const initialState = {
  name: "",
  description: "",
  price: "",
  duration: "",
  max_sites: "",
  max_ponds: "",
  max_workers: "",
};

export default ServicePlans;
