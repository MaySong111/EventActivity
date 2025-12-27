import { Card, Badge, CardMedia, Box, Typography, Button } from "@mui/material";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  attendActivity,
  toggleActivityCancellation,
  unattendActivity,
} from "../http";
import toast from "react-hot-toast";
import { useState } from "react";

export default function ActivityDetailsHeader({ activity }) {
  const [isCancelled, setIsCancelled] = useState(activity.isCancelled);
  const [isAttending, setIsAttending] = useState(activity.isAttending);
  const isHost = activity.isHost;

  const handleToggleCancellation = async () => {
    if (!isHost) return;
    try {
      if (isHost) {
        await toggleActivityCancellation(activity.id);
        setIsCancelled(!isCancelled);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAttendance = async () => {
    if (isHost) return;
    try {
      if (isAttending) {
        await unattendActivity(activity.id);
      } else {
        await attendActivity(activity.id);
      }
      setIsAttending(!isAttending);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card
      sx={{
        position: "relative",
        mb: 2,
        backgroundColor: "transparent",
        overflow: "hidden",
      }}
    >
      {isCancelled && (
        <Badge
          sx={{ position: "absolute", left: 40, top: 20, zIndex: 1000 }}
          color="error"
          badgeContent="Cancelled"
        />
      )}
      <CardMedia
        component="img"
        height="300"
        image={`/images/categoryImages/${activity?.category}.jpg`}
        alt={`${activity?.category} image`}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          color: "white",
          padding: 2,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 1.0), transparent)",
          boxSizing: "border-box",
        }}
      >
        {/* Text Section */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {activity.title}
          </Typography>
          <Typography variant="subtitle1">
            {format(activity.date, "dd MMM yyyy h:mm a")}
          </Typography>
          <Typography variant="subtitle2">
            Hosted by{" "}
            <Link
              to={`/profiles/${activity.hostDisplayName}`}
              style={{ color: "white", fontWeight: "bold" }}
            >
              {activity.hostDisplayName}
            </Link>
          </Typography>
        </Box>

        {/* Buttons aligned to the right
        isHost 能看到的的, 以及非 Host 看到的按钮 */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {isHost ? (
            <>
              <Button
                variant="contained"
                color={isCancelled ? "success" : "error"}
                sx={{ borderRadius: 2 }}
                onClick={handleToggleCancellation}
              >
                {isCancelled ? "Re-activate Activity" : "Cancel Activity"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/edit/${activity.id}`}
                disabled={isCancelled}
                sx={{ borderRadius: 2 }}
              >
                Edit activity
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color={isAttending ? "primary" : "info"}
              onClick={handleAttendance}
              disabled={isCancelled}
            >
              {isAttending ? "Cancel Attendance" : "Join Activity"}
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
}
