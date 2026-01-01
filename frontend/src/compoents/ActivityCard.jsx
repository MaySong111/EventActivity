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
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteActivity } from "../http";

export default function ActivityCard({ activity }) {
  const { isHost, isAttending, isCancelled } = activity;

  const label = isHost
    ? "You are hosting"
    : isAttending
    ? "You are attending"
    : null;

  const color = isHost ? "primary.main" : "secondary.main";

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
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 16px 32px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ height: 60, width: 60, borderRadius: 3 }}
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
              <Link to={`/profiles/${activity.hostId}`}>
                {activity.hostDisplayName}
              </Link>
            </Typography>
          }
        />

        <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
          {!isCancelled && (isHost || isAttending) && (
            <Chip
              label={label}
              sx={{
                borderRadius: 2,
                bgcolor: "transparent",
                border: "1px solid",
                borderColor: color,
                color: color,
              }}
            />
          )}
          {isCancelled && (
            <Chip
              label="Cancelled"
              sx={{
                borderRadius: 2,
                bgcolor: "error.main",
                color: "white",
              }}
            />
          )}
        </Box>
      </Box>
      <Divider />

      <CardContent sx={{ pt: 1.5, pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 0 }}>
            <AccessTime sx={{ mr: 1 }} />
            <Typography variant="body2" noWrap>
              {format(activity?.date, "dd MMM yyyy h:mm a")}
            </Typography>
          </Box>

          <Place sx={{ mr: 1, ml: 3 }} />
          <Typography variant="body2">{activity?.venue}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            py: 1.5,
            bgcolor: "rgba(134, 191, 238, 0.08)",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", mr: 2 }}>
            {activity.attendees.slice(0, 3).map((attendee, index) => (
              <Tooltip key={attendee.id} title={attendee.displayName}>
                <Avatar
                  alt={attendee.displayName}
                  component={Link}
                  to={`/profiles/${attendee.id}`}
                  src={attendee.imageUrl}
                  sx={{
                    border: "2px solid white",
                    marginLeft: index > 0 ? "-12px" : 0,
                    zIndex: 3 - index,
                    "&:hover": { zIndex: 10 },
                  }}
                />
              </Tooltip>
            ))}
          </Box>
          {activity.attendees.length > 3 && (
            <Typography variant="body2" color="text.secondary">
              +{activity.attendees.length - 3} more
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardContent>
        <Typography variant="body2">{activity.description}</Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          {isHost && (
            <Button
              size="medium"
              variant="outlined"
              color="error"
              sx={{ borderRadius: 2 }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
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
