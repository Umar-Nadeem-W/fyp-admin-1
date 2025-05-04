import React, { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, TextField, Typography, MenuItem
} from "@mui/material";
import axios from "axios";

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

const notificationTypes = ["Alert", "Task", "System", "Inventory", "Message"];

const SendAnnouncementToOne = () => {
  const [owners, setOwners] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [type, setType] = useState("System");
  const [message, setMessage] = useState("");

  const fetchOwners = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/owners", axiosConfig);
      setOwners(response.data);
    } catch (err) {
      console.error("Failed to fetch owners:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/admin/send",
        {
          recipient_id: recipientId,
          message,
          notification_type: type,
        },
        axiosConfig
      );
      alert("Notification sent!");
      setMessage("");
      setRecipientId("");
      setType("System");
    } catch (err) {
      console.error("Failed to send announcement:", err.response?.data || err.message);
    }
  };

  return (
    <Box m={4}>
      <Card>
        <CardContent>
          <Typography variant="h6">Send Notification to Specific Farm Owner</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              select
              label="Select Farm Owner"
              fullWidth
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              margin="normal"
              required
            >
              {owners.map((owner) => (
                <MenuItem key={owner.id} value={owner.id}>
                  {owner.owner_name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Notification Type"
              fullWidth
              value={type}
              onChange={(e) => setType(e.target.value)}
              margin="normal"
              required
            >
              {notificationTypes.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Message"
              fullWidth
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              margin="normal"
              required
            />

            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SendAnnouncementToOne;
