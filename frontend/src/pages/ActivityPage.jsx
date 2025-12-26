import { Box, Button, Container, Grid2, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ActivityCard from "../compoents/ActivityCard";
import { getActivities } from "../http";
import ActivityFilters from "../compoents/ActivityFilters";
import { Link } from "react-router-dom";

export default function ActivitiesPage() {
  // 用react Query,那就不需要useState这个本地存储了,直接用useQuery去fetch数据就行, 而且也不用useEffect去fetch数据
  // const [selectedActivity, setSelectedActivity] = useState(null);
  // const queryClient = useQueryClient();
  // useEffect(() => {
  // const fetchData = async () => {
  //   try {
  //     const response = await fetch("https://localhost:5001/api/activities");
  //     const data = await response.json();
  //     setActivities(data);

  //     } catch (error) {
  //       console.error("Error fetching activities:", error);
  //     }

  //   };
  //   fetchData();
  // }, []);

  //   如果 data 为 undefined，activities 会被赋值为 []---那么![] 永远都是false
  // 所以在初始渲染或者 fetch 还没返回时，activities = []
  //不设置初始值（data 默认 undefined）,那么后面的三元判断可以用!activities || isLoading ?
  // 但这样的话 activities.map 会报错，因为 activities 可能是 undefined
  // 所以更好的方式是设置初始值为一个空数组 []，这样 activities.map 在初始渲染时也不会报错--那判断的时候就不能用!activities了--因为永远都是false,没有意义
  // 而是用 isLoading ||  来判断是否在加载中

  // 注意点: useQuery 调用 queryFn 后，返回的数据会被赋值给 data. 所以这里的 response 就是 getActivities 返回的数据
  // 但是我后端{isSuccess, message , data} 也就是response,也是 queryKey: ["activities"],这个key对应的数据, 注意只有response.data 才是我想要的活动数组
  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });
  // console.log("ActivityPage response data part:", activities);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!activities || activities.length === 0)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          There are no activities yet. Create one to get started!
        </Typography>
        <Button component={Link} to="/create-activity" variant="contained">
          Create Activity
        </Button>
      </Box>
    );

  return (
    <Box sx={{ bgcolor: "#eeeeee", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Grid2 container spacing={3}>
          {/* 左边：活动列表 */}
          <Grid2 size={8}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {activities?.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </Box>
          </Grid2>

          {/* 右边：选中的活动详情 */}
          <Grid2 size={4}>
            {/* {selectedActivity && (
                <ActivityCard activity={selectedActivity} isDetail />
              )}
              <CreatePage /> */}
            <ActivityFilters />
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
