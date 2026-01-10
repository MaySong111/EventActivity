import { Box, Typography, Paper, Divider } from "@mui/material";

export default function AboutTab({ profile, statistics }) {
    // profile: { displayName, bio, imageUrl }
  // statistics: { total, hosting, attending } - 可选

  return (
    <Box>
      {/* Bio 区域 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          About {profile.displayName}
        </Typography>
        <Typography color="text.secondary">
          {profile.bio || "No bio yet"}
        </Typography>
      </Paper>

      {/* 统计信息卡片 - 可选显示 */}
      {statistics && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Activity Summary
          </Typography>
          <Box sx={{ display: "flex", gap: 4 }}>
            <Box>
              <Typography variant="h4" color="primary.main">
                {statistics.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Activities
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="h4" color="secondary.main">
                {statistics.hosting}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hosting
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="h4" color="info.main">
                {statistics.attending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attending
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
}