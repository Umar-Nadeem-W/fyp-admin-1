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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employee");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedId) {
        await axios.put(`http://localhost:5000/api/employee/${selectedId}`, employeeData);
      } else {
        await axios.post("http://localhost:5000/api/employee", employeeData);
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
      await axios.delete(`http://localhost:5000/api/employee/${id}`);
      fetchEmployees();
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

      <Typography variant="h5" gutterBottom>
        All Employees
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Employee Name</TableCell> {/* NEW */}
              <TableCell>Status</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.e_id}>
                <TableCell>{emp.e_id}</TableCell>
                <TableCell>{emp.u_id}</TableCell>
                <TableCell>{emp.employee_name || "N/A"}</TableCell> {/* NEW */}
                <TableCell>{emp.status}</TableCell>
                <TableCell>{emp.designation}</TableCell>
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
