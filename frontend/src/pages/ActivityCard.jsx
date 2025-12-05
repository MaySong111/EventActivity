import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Typography,
  Box,
} from "@mui/material";

export default function ActivityCard({ activity, onView, onDelete, isDetail }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      {isDetail && (
        <CardMedia
          component="img"
          image={`/images/categoryImages/${activity?.category}.jpg`}
          alt={activity?.title}
        />
      )}
      <CardContent>
        <Typography variant="h5">{activity?.title}</Typography>
        <Typography sx={{ color: "text.secondary" }}>
          {activity?.date}
        </Typography>
        <Typography variant="body2">{activity?.description}</Typography>
        <Typography variant="subtitle1">
          {activity?.city}/{activity?.venue}
        </Typography>
      </CardContent>
      {!isDetail && (
        <CardActions
          sx={{ display: "flex", justifyContent: "space-between", pb: 2 }}
        >
          <Chip label={activity?.category} variant="outlined" />
          <Box sx={{ display: "flex", gap: 3 }}>
            <Button
              size="medium"
              variant="contained"
              onClick={() => onView(activity)}
            >
              View
            </Button>
            <Button
              size="medium"
              variant="contained"
              color="error"
              onClick={() => onDelete(activity.id)}
            >
              DELETE
            </Button>
          </Box>
        </CardActions>
      )}
    </Card>
  );
}
