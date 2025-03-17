import React, { useState } from "react";
import { Box, Button, TextField, Typography, List, ListItem, ListItemText, Divider, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Header } from "components";

const groups = ["Farm 1", "Farm 2", "Farm 3"];

const Communications = () => {
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { group: selectedGroup, text: newMessage, sender: "You" }]);
      setNewMessage("");
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Communications" subtitle="Send and receive messages with fellow workers." />

      <FormControl fullWidth margin="normal">
        <InputLabel>Group</InputLabel>
        <Select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          {groups.map((group) => (
            <MenuItem key={group} value={group}>{group}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", borderRadius: "4px", p: 2, mb: 2 }}>
        <List>
          {messages.filter(msg => msg.group === selectedGroup).map((msg, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${msg.sender}: ${msg.text}`} />
            </ListItem>
          ))}
        </List>
      </Box>

      <TextField
        label="Type your message"
        fullWidth
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={handleSend}>
        Send
      </Button>
    </Box>
  );
};

export default Communications;
