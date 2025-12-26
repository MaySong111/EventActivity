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
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteActivity } from "../http";
import useAuthStore from "../store/useAuthStore";

export default function ActivityCard({ activity }) {
  const user = useAuthStore((state) => state.user);
  const isHost = false; // TODO: determine if the current user is the host
  const isGoing = false; // TODO: determine if the current user is going
  const label = isHost
    ? "You are hosting this activity"
    : isGoing
    ? "You are going to this activity"
    : null;
  const isCancelled = false;
  const color = isHost ? "secondary" : isGoing ? "warning" : "default";

  console.log("ActivityCard activity:", activity);

  const queryClient = useQueryClient();
  const deleteActivityMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: (result) => {
      queryClient.invalidateQueries(["activities"]);
      toast.success(result.message);
    },
  });
  const handleDelete = () => {
    deleteActivityMutation.mutate(activity.id);
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ height: 50, width: 50 }}
              src={`/images/categoryImages/${activity?.category}.jpg`}
            />
          }
          title={
            <Typography
              variant="h5"
              sx={{ whiteSpace: "nowrap", fontWeight: 500, fontSize: "1.4rem" }}
            >
              {activity.title}
            </Typography>
          }
          subheader={
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 400, fontSize: "1rem" }}
            >
              Hosted by{" "}
              <Link to={`/profiles/${activity.hostDisplayName}`}>
                {activity.hostDisplayName}
              </Link>
            </Typography>
          }
          sx={{ flexGrow: 1, p: 2, "& .MuiCardHeader-avatar": { mr: 1.5 } }}
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

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            size="medium"
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
            onClick={handleDelete}
          >
            Delete
          </Button>

          <Button
            component={Link}
            to={`/activities/${activity.id}`}
            size="medium"
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            View
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
