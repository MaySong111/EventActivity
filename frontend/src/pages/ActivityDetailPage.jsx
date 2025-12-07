import { Box, Grid2 } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getActivity } from "../http";
import ActivityDetailsHeader from "../compoents/ActivityDetailHeader";
import ActivityDetailsInfo from "../compoents/ActivityDetailedInfo";
import ActivityDetailsChat from "../compoents/ActivityDetailedChat";
import ActivityDetailsSidebar from "../compoents/ActivityDetailedSidebar";

export default function ActivityDetailPage() {
  // 这就是点击ActivitPage里的view按钮后跳转到的这个详情页的,获取到id(但是page实际上用的是ActivityCard.jsx中的view按钮--也就是这个子组件才是真正的跳转按钮)
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: activity, isPending } = useQuery({
    queryKey: ["activities", id],
    queryFn: () => getActivity(id),
  });

  if (isPending) return <div>Loading...</div>;
  if (!activity) return <div>Activity not found</div>;

  return (
    <div>
      {/* sidebar */}
      <Box sx={{ p: 3 }}>
        <Grid2 container spacing={3}>
          <Grid2 size={8}>
            {/* header */}
            <ActivityDetailsHeader activity={activity} />
            {/* info */}
            <ActivityDetailsInfo activity={activity} />
            {/* chat */}
            <ActivityDetailsChat />
          </Grid2>

          {/* sidebar */}
          <Grid2 size={4}>
            <ActivityDetailsSidebar />
          </Grid2>
        </Grid2>
      </Box>
    </div>
  );
}
