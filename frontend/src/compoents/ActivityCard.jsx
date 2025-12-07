import { AccessTime, Place } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Chip,
  Button,
  Typography,
  Box,
  CardHeader,
  Avatar,
  Divider,
} from "@mui/material";
import { Link } from "react-router";
import { format } from "date-fns";

export default function ActivityCard({ activity }) {
  const isHost = false; // TODO: determine if the current user is the host
  const isGoing = false; // TODO: determine if the current user is going
  const label = isHost
    ? "You are hosting this activity"
    : isGoing
    ? "You are going to this activity"
    : null;
  const isCancelled = false;
  const color = isHost ? "secondary" : isGoing ? "warning" : "default";

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ height: 80, width: 80 }}
              src={`/images/categoryImages/${activity?.category}.jpg`}
              title={activity.title}
              subheader={
                <>
                  Hosted by <Link to={`/profiles/bob}`}>bob</Link>
                </>
              }
            />
          }
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mr: 2 }}>
          {isHost ||
            (isGoing && (
              <Chip label={label} color={color} sx={{ borderRadius: 2 }} />
            ))}
          {isCancelled && (
            <Chip label="Cancelled" color="error" sx={{ borderRadius: 2 }} />
          )}
        </Box>
      </Box>
      <Divider />

      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, px: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 0 }}>
            <AccessTime sx={{ mr: 1 }} />
            <Typography variant="body2" noWrap>
              {format(activity?.date, "dd MMM yyyy h:mm a")}
            </Typography>
          </Box>

          <Place sx={{ mr: 1, ml: 3 }} />
          <Typography variant="body2">{activity?.venue}</Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            gap: 2,
            backgroundColor: "grey.200",
            py: 3,
            pl: 3,
          }}
        >
          Attendees go here
        </Box>
      </CardContent>

      <CardContent sx={{ pb: 2 }}>
        <Typography variant="body2">{activity.description}</Typography>

        <Button
          component={Link}
          to={`/activities/${activity.id}`}
          size="medium"
          variant="contained"
          sx={{ display: "flex", justifySelf: "self-end", borderRadius: 3 }}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
}
