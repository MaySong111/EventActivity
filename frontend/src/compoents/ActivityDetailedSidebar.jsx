import {
  Paper,
  Typography,
  List,
  ListItem,
  Chip,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Grid2,
} from "@mui/material";

export default function ActivityDetailsSidebar({ activity }) {
  console.log(activity);
  
  return (
    <>
      <Paper
        sx={{
          textAlign: "center",
          border: "none",
          backgroundColor: "primary.main",
          color: "white",
          p: 2,
        }}
      >
        <Typography variant="h6">
          {activity.attendees.length} people going
        </Typography>
      </Paper>
      <Paper sx={{ padding: 2 }}>
        {activity.attendees.map((att) => (
          <Grid2 container alignItems="center" key={att.id}>
            <Grid2 size={8}>
              <List sx={{ display: "flex", flexDirection: "column" }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={att.displayName} src={att.imageUrl} />
                  </ListItemAvatar>
                  <ListItemText>
                    <Typography variant="h6">{att.displayName}</Typography>
                  </ListItemText>
                </ListItem>
              </List>
            </Grid2>
            <Grid2
              size={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              {att.id === activity.hostId && (
                <Chip
                  label="Host"
                  color="warning"
                  variant="filled"
                  sx={{ borderRadius: 2 }}
                />
              )}
            </Grid2>
          </Grid2>
        ))}
      </Paper>
    </>
  );
}
