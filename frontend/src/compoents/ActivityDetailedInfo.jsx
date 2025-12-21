import { CalendarToday, Info, Place } from "@mui/icons-material";
import { Box, Button, Divider, Grid2, Paper, Typography } from "@mui/material";
import { format } from "date-fns";
import Map from "./Map";
import { useState } from "react";

export default function ActivityDetailsInfo({ activity }) {
  // console.log("ActivityDetailsInfo activity:", activity);
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <Paper sx={{ mb: 2 }}>
      <Grid2 container alignItems="center" pl={2} py={1}>
        <Grid2 size={1}>
          <Info color="info" fontSize="large" />
        </Grid2>
        <Grid2 size={11}>
          <Typography>{activity.description}</Typography>
        </Grid2>
      </Grid2>
      <Divider />
      <Grid2 container alignItems="center" pl={2} py={1}>
        <Grid2 size={1}>
          <CalendarToday color="info" fontSize="large" />
        </Grid2>
        <Grid2 size={11}>
          <Typography>
            {format(activity?.date, "dd MMM yyyy h:mm a")}
          </Typography>
        </Grid2>
      </Grid2>
      <Divider />

      <Grid2 container alignItems="center" pl={2} py={1}>
        <Grid2 size={1}>
          <Place color="info" fontSize="large" />
        </Grid2>
        <Grid2
          size={11}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>
            {activity.venue}, {activity.city}
          </Typography>
          <Button onClick={() => setMapOpen(!mapOpen)}>
            {mapOpen ? "Hide Map" : "Show Map"}
          </Button>
        </Grid2>
      </Grid2>
      {mapOpen && (
        <Box sx={{ height: 400, zIndex: 1000, display: "block" }}>
          <Map  position={[activity.latitude, activity.longitude]}  venue={activity.venue}/>
        </Box>
      )}
    </Paper>
  );
}
