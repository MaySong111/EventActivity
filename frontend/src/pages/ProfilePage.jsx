import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
// import { useMutation } from "@tanstack/react-query";
// import { uploadProfilePhoto } from "../http";

export default function ProfilePage() {


  return (
    <div>
      <Card
        sx={{ borderRadius: 2, p: 2, maxWidth: 300, textDecoration: "none" }}
      >
        <CardMedia
          component="img"
          src={"/default-profile.png"}
          sx={{ width: 200, zIndex: 50 }}
          alt="Profile Image"
        />
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography>{"user.displayName"}</Typography>
            <p>{"user.username"}</p>
            <p>{"user.bio"}</p>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
