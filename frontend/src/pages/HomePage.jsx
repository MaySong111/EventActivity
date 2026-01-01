import { Box, Button, Paper, Typography } from "@mui/material";
import { Group } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <Paper
      elevation={0}
      square
      sx={{
        margin: 0,
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Group sx={{ height: 110, width: 110 }} />
        <Typography variant="h1">Activities</Typography>
      </Box>
      <Typography variant="h2">Welcome to activities!</Typography>
      <Button
        component={Link}
        to="/activities"
        size="large"
        variant="contained"
        sx={{ height: 80, borderRadius: 4, fontSize: "1.5rem" }}
      >
        Take me to Activities!
      </Button>
    </Paper>
  );
}
