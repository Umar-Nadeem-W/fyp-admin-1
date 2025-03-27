import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialState = {
  u_id: "",
  status: "not approved",
  designation: "",
  manage_devices: false,
  send_announcement: false,
  manage_users: false,
  can_see_complaints: false,
};

const AddEmployee = () => {
  const [employeeData, setEmployeeData] = useState(initialState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData({ ...employeeData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/employee", employeeData);
      navigate("/employee-info"); // go back to list
    } catch (err) {
      console.error("Error adding employee:", err);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Add Employee
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="User ID"
                name="u_id"
                type="number"
                value={employeeData.u_id}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Designation"
                name="designation"
                value={employeeData.designation}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Status"
                name="status"
                value={employeeData.status}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            {[
              { label: "Manage Devices", name: "manage_devices" },
              { label: "Send Announcement", name: "send_announcement" },
              { label: "Manage Users", name: "manage_users" },
              { label: "Can See Complaints", name: "can_see_complaints" },
            ].map(({ label, name }) => (
              <Grid item xs={12} sm={6} key={name}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={employeeData[name]}
                      onChange={handleChange}
                      name={name}
                    />
                  }
                  label={label}
                />
              </Grid>
            ))}
          </Grid>

          <Box mt={3}>
            <Button type="submit" variant="contained" sx={{ mr: 2 }}>
              Create
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate("/employee-info")}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddEmployee;
