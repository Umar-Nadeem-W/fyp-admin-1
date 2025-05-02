import React, { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, CircularProgress, IconButton
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data);
    } catch (err) {
      console.error("Error fetching notifications:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from state
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err.response?.data || err.message);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box m={3}>
      <Typography variant="h5">My Notifications</Typography>
      {notifications.length > 0 ? (
        notifications.map((notif) => (
          <Card key={notif.id} sx={{ mt: 2, position: "relative" }}>
            <CardContent>
              <Typography>{notif.message}</Typography>
              <Typography variant="caption">Type: {notif.notification_type}</Typography>
              <IconButton
                onClick={() => deleteNotification(notif.id)}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <Delete />
              </IconButton>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No notifications found.</Typography>
      )}
    </Box>
  );
};

export default Notifications;
