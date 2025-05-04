import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
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

const EmployeeInfo = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState(initialState);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedId) {
        await axios.put(`http://localhost:5000/api/admin/employees/${selectedId}`, employeeData);
      } else {
        await axios.post("http://localhost:5000/api/admin/employees", employeeData);
      }
      fetchEmployees();
      resetForm();
    } catch (err) {
      console.error("Error saving employee:", err);
    }
  };

  const resetForm = () => {
    setEmployeeData(initialState);
    setSelectedId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData({ ...employeeData, [name]: type === "checkbox" ? checked : value });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.e_id !== id)); // Optimistically update UI
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  return (
    <Box p={isSmallScreen ? 2 : 4}>
      {showForm && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6">{selectedId ? "Edit" : "Add"} Employee</Typography>
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
                {selectedId ? "Update" : "Create"}
              </Button>
              <Button variant="outlined" color="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Box mb={2}>
        <Button variant="contained" onClick={() => navigate("/add-employee")}>
          Add New Employee
        </Button>
      </Box>


      <Typography variant="h5" gutterBottom>
        All Employees
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Manage Device</TableCell>
              <TableCell>Send Announcement</TableCell>
              <TableCell>Manage Users</TableCell>
              <TableCell>Can See Complaints</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.e_id}>
                <TableCell>{emp.e_id}</TableCell>
                <TableCell>{emp.u_id}</TableCell>
                <TableCell>{emp.user_name || "N/A"}</TableCell>
                <TableCell>{emp.status}</TableCell>
                <TableCell>{emp.designation}</TableCell>
                <TableCell>{emp.manage_devices ? "Yes" : "No"}</TableCell>
                <TableCell>{emp.send_announcement ? "Yes" : "No"}</TableCell>
                <TableCell>{emp.manage_users ? "Yes" : "No"}</TableCell>
                <TableCell>{emp.can_see_complaints ? "Yes" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => setViewEmployee(emp)}>
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedId(emp.e_id);
                      setEmployeeData(emp);
                      setShowForm(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(emp.e_id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!viewEmployee} onClose={() => setViewEmployee(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent dividers>
          {viewEmployee && (
            <List>
              {Object.entries(viewEmployee).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText primary={key.replace(/_/g, " ")} secondary={value?.toString()} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewEmployee(null)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeInfo;
