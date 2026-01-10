import { Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";

export default function ProfileTabs({ tabs }) {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box>
      {/* Tab 导航栏 */}
      <Tabs
        value={currentTab}
        onChange={handleChange}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 3,
        }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {/* Tab 内容区 */}
      <Box>{tabs[currentTab].component}</Box>
    </Box>
  );
}
