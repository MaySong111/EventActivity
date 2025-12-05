import { useEffect, useState } from "react";
import { Container, Grid2, Box } from "@mui/material";
import Navbar from "../Navbar";
import ActivityCard from "./ActivityCard";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:5001/api/activities");
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar isLoginedIn={false} />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Grid2 container spacing={3}>
          {/* 左边：活动列表 */}
          <Grid2 size={7}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onView={() => setSelectedActivity(activity)}
                  onDelete={(id) =>
                    setActivities(activities.filter((a) => a.id !== id))
                  }
                />
              ))}
            </Box>
          </Grid2>

          {/* 右边：选中的活动详情 */}
          <Grid2 size={5}>
            {selectedActivity && (
              <ActivityCard activity={selectedActivity} isDetail />
            )}
          </Grid2>
        </Grid2>
      </Container>
    </>
  );
}
