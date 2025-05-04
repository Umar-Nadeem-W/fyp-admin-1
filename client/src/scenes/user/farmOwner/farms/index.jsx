import React, { useEffect, useState } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";

//We need to change this, so that only the farm s owned by the logged
//in owner will be shown. Rn its showing all the farms in the database.

const Farms = () => {
  const [farms, setFarms] = useState([]); // Ensure farms is always an array
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); // Add navigate hook

  useEffect(() => {
    // Fetch data from the backend
    fetch("http://localhost:5000/api/farms")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setFarms(data); // Ensure data is an array
        } else {
          throw new Error("API did not return an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching farms:", error);
        setError(error.message); // Set error message
      });
  }, []);

  return (
    <Box m={3}>
      {/* Add Farm Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/farms/addfarm")}
        >
          Add Farm
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      {/* Farms Table */}
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
              <TableCell>Number of Ponds</TableCell>
              <TableCell>Number of Workers</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {farms.length > 0 ? (
              farms.map((farm) => (
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
                    <Button onClick={() => alert(`Edit farm: ${farm.name}`)}>
                      <Edit />
                    </Button>
                    <Button sx={{ color: "red" }} onClick={() => alert(`Delete farm: ${farm.name}`) }>
                      <Delete />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No farms available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Farms;
