import { Card, CardContent, Typography, CardMedia } from "@mui/material";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function ActivityMiniCard({ activity }) {
  return (
    <>
      <Card
        component={Link}
        to={`/activities/${activity.id}`}
        sx={{
          textDecoration: "none",
          borderRadius: 3,
          overflow: "hidden",
          transition: "all 0.3s",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: 6,
          },
        }}
      >
        {/* 封面图 */}
        <CardMedia
          component="img"
          height="100"
          image={`/images/categoryImages/${activity.category}.jpg`}
          alt={activity.title}
          sx={{
            objectFit: "cover",
          }}
        />

        {/* 内容区 */}
        <CardContent sx={{ p: 1}}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {activity.title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {format(new Date(activity.date), "dd MMM yyyy")}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {format(new Date(activity.date), "h:mm a")}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}
