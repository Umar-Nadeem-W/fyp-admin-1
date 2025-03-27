import React, { useState } from "react";
import { Box, Typography, TextField, Card, CardContent, FormControl} from "@mui/material";
import { Header } from "components";
import { format } from "date-fns";

const announcementsData = [
  { date: "2025-03-15", title: "Pond Closure", description: "Pond A will be closed for maintenance." },
  { date: "2025-03-16", title: "Eid Get Together", description: "All workers are invited to an Eid celebration at 5 PM." },
];

const Announcements = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  const filteredAnnouncement = announcementsData.find(
    (announcement) => announcement.date === selectedDate
  );

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Announcements" />

      <FormControl fullWidth margin="normal">
        <TextField
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </FormControl>

      {filteredAnnouncement ? (
        <Card variant="outlined" sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">{filteredAnnouncement.title}</Typography>
            <Typography variant="body1">{filteredAnnouncement.description}</Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>Date: {filteredAnnouncement.date}</Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No announcements for the selected date.
        </Typography>
      )}
    </Box>
  );
};

export default Announcements;
