import { Box, Typography, Paper, Grid2, LinearProgress } from "@mui/material";
import {
  EmojiEvents,
  Group,
  CalendarMonth,
  CheckCircle,
} from "@mui/icons-material";

export default function StatisticsTab({ statistics }) {
  if (!statistics || statistics.total === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          No activity data yet. Join or host activities to see statistics!
        </Typography>
      </Box>
    );
  }

  const { total, hosting, attending, upcoming, past } = statistics;

  // 统计卡片数据
  const stats = [
    {
      label: "Total Activities",
      value: total,
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
      color: "primary.main",
    },
    {
      label: "Hosting",
      value: hosting,
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      color: "secondary.main",
    },
    {
      label: "Attending",
      value: attending,
      icon: <Group sx={{ fontSize: 40 }} />,
      color: "info.main",
    },
    {
      label: "Completed",
      value: past,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: "success.main",
    },
  ];

  return (
    <Box>
      {/* 大数字卡片 */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid2 key={index} size={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 600 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid2>
        ))}
      </Grid2>

      {/* 进度条对比 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Activity Breakdown
        </Typography>

        {/* Hosting */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="body2">Hosting</Typography>
            <Typography variant="body2" fontWeight={600}>
              {hosting} ({total > 0 ? ((hosting / total) * 100).toFixed(0) : 0}
              %)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={total > 0 ? (hosting / total) * 100 : 0}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                bgcolor: hosting > 0 ? "secondary.main" : "grey.300",
                transition: "transform 0.8s ease-in-out",
              },
            }}
          />
        </Box>

        {/* Attending */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="body2">Attending</Typography>
            <Typography variant="body2" fontWeight={600}>
              {attending} (
              {total > 0 ? ((attending / total) * 100).toFixed(0) : 0}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={total > 0 ? (attending / total) * 100 : 0}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                bgcolor: attending > 0 ? "info.main" : "grey.300",
                transition: "transform 0.8s ease-in-out",
              },
            }}
          />
        </Box>
      </Paper>

      {/* 时间线对比 */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Timeline Overview
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="body2">Upcoming Events</Typography>
            <Typography variant="body2" fontWeight={600}>
              {upcoming}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={total > 0 ? (upcoming / total) * 100 : 0}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                bgcolor: upcoming > 0 ? "warning.main" : "grey.300",
                transition: "transform 0.8s ease-in-out",
              },
            }}
          />
        </Box>

        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="body2">Completed Events</Typography>
            <Typography variant="body2" fontWeight={600}>
              {past}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={total > 0 ? (past / total) * 100 : 0}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                bgcolor: past > 0 ? "success.main" : "grey.300",
                transition: "transform 0.8s ease-in-out",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}