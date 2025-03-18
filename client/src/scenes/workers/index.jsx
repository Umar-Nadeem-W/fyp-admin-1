import React, { useState } from "react";
import { Box, Typography, Button, TextField, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Header } from "components";

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [workerData, setWorkerData] = useState({ name: "", designation: "", farm: "" });
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showWorkerForm, setShowWorkerForm] = useState(false);

  const handleWorkerSubmit = (e) => {
    e.preventDefault();
    if (selectedWorker !== null) {
      setWorkers(workers.map((worker, index) => (index === selectedWorker ? workerData : worker)));
    } else {
      setWorkers([...workers, workerData]);
    }
    setShowWorkerForm(false);
    setWorkerData({ name: "", designation: "", farm: "" });
    setSelectedWorker(null);
  };

  const handleDeleteWorker = (index) => {
    setWorkers(workers.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Header title="Workers" subtitle="List of Workers" />

      <Button variant="contained" onClick={() => { setShowWorkerForm(true); setSelectedWorker(null); }} sx={{ mt: 2 }}>
        Add Worker
      </Button>

      {showWorkerForm && (
        <Box component="form" mt={2} p={2} onSubmit={handleWorkerSubmit} sx={{ border: "1px solid gray", borderRadius: "8px" }}>
          <TextField fullWidth label="Worker Name" value={workerData.name} onChange={(e) => setWorkerData({ ...workerData, name: e.target.value })} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Designation" value={workerData.designation} onChange={(e) => setWorkerData({ ...workerData, designation: e.target.value })} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Farm" value={workerData.farm} onChange={(e) => setWorkerData({ ...workerData, farm: e.target.value })} required sx={{ mb: 2 }} />
          <Button variant="contained" type="submit">{selectedWorker !== null ? "Update Worker" : "Add Worker"}</Button>
        </Box>
      )}

      <Typography variant="h5" mt={3}>Workers List</Typography>
      {workers.length > 0 ? (
        workers.map((worker, index) => (
          <Box key={index} p={2} mt={2} sx={{ border: "1px solid gray", borderRadius: "8px" }}>
            <Typography variant="h6">{worker.name}</Typography>
            <Typography variant="body2">Designation: {worker.designation}</Typography>
            <Typography variant="body2">Farm: {worker.farm}</Typography>
            <Button variant="outlined" onClick={() => { setSelectedWorker(index); setWorkerData(worker); setShowWorkerForm(true); }} sx={{ mt: 1, mr: 1 }}>Edit</Button>
            <Button variant="outlined" color="error" onClick={() => handleDeleteWorker(index)} sx={{ mt: 1 }}>Delete</Button>
            
          </Box>
        ))
      ) : (
        <Typography variant="body1" mt={2}>No workers available</Typography>
      )}
    </Box>
  );
};

export default Workers;