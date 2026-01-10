import { Box, Tabs, Tab, Typography } from "@mui/material";
import { useState} from "react";
import useAuthStore from "../store/useAuthStore";
import ActivityMiniCard from "./ActivityMiniCard";

export default function ActivitiesTab({ activities, isOwnProfile }) {
  const [subTab, setSubTab] = useState(0);
  const { user: currentUser } = useAuthStore();

  // 根据当前时间分类活动
  let categorizedActivities = { future: [], past: [], hosting: [] };
  if (activities && activities.length > 0) {
    const now = new Date();
    categorizedActivities = {
      future: activities
        .filter((a) => new Date(a.date) > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
      past: activities
        .filter((a) => new Date(a.date) <= now)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
      hosting: activities
        .filter((a) => a.hostId === currentUser?.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    };
  }

  // 子 Tab 配置
  const subTabs = isOwnProfile
    ? [
        { label: "FUTURE EVENTS", data: categorizedActivities.future },
        { label: "PAST EVENTS", data: categorizedActivities.past },
        { label: "HOSTING", data: categorizedActivities.hosting },
      ]
    : [
        // 别人的 Profile 只显示 Hosting
        { label: "HOSTING", data: activities || [] },
      ];

  const currentActivities = subTabs[subTab].data;

  // console.log("ActivitiesTab render-currentActivities:", currentActivities);
  return (
    <Box>
      {/* 子 Tab 导航 */}
      <Tabs
        value={subTab}
        onChange={(e, newValue) => setSubTab(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        {subTabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {/* 活动网格 */}
      {currentActivities.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            No activities found in this category.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 3,
          }}
        >
          {currentActivities.map((activity) => (
            <ActivityMiniCard key={activity.id} activity={activity} />
          ))}
        </Box>
      )}
    </Box>
  );
}
