import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  List,
  ListItemButton,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createActivity,
  getActivity,
  LocationIQ_API_KEY,
  updateActivity,
} from "../http";
import toast from "react-hot-toast";
import { format } from "date-fns";
import useAuthStore from "../store/useAuthStore";

export default function CreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
    category: "",
    city: "",
    venue: "",
    latitude: "",
    longitude: "",
  });

  // 1. API 返回的建议列表
  const [suggestions, setSuggestions] = useState([]); // LocationIQ 返回的建议
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // 如果是 location 字段，且超过3个字符才, 才会去触发 API
    if (name === "venue" && value.length >= 3) {
      fetchSuggestions(value);
    } else if (name === "venue" && value.length < 3) {
      setSuggestions([]);
    }
  };

  // 2. 用户输入变化时触发的函数
  const fetchSuggestions = async (input) => {
    const response = await fetch(
      `${LocationIQ_API_KEY}&q=${input}&limit=5&dedupe=1&`
    );
    const data = await response.json();
    setSuggestions(data); // 更新建议列表/一个数组
  };

  // 3. 用户选择了某个建议
  const handleSelectSuggestion = (suggestion) => {
    // 传递过来的suggestion 是这个：
    // {
    //   display_name: "Sydney Opera House, Sydney, NSW...",
    //   address: { city: "Sydney" },
    //   lat: "-33.8567844",
    //   lon: "151.2152967"
    // }
    setForm((prev) => ({
      ...prev,
      city: suggestion.address?.city || "",
      venue: suggestion.display_name,
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    })); // 更新输入框显示
    setSuggestions([]); // 清空建议列表
  };

  const queryClient = useQueryClient();
  // 定义 createMutation函数---发post请求新建一个 activity
  const createActivityMutation = useMutation({
    mutationFn: createActivity, // 应该是定义函数, 而不是调用函数!!!!!
    // 成功后的操作: onSuccess 这里是在执行fetch之后才会调用,所以这里不能放 验证逻辑
    onSuccess: (result) => {
      // console.log("Mutation successful:", result);
      toast.success(result.message);
      // 更新缓存
      queryClient.invalidateQueries(["activities"]);
      // // 重置表单
      // 登录成功会跳转页面，清空表单没意义，而且如果登录失败，用户还得重新输入。---同样这里也是一样,不要清空表单
      // setForm({
      //   title: "",
      //   description: "",
      //   category: "",
      //   dateTime: "",
      //   city: "",
      //   venue: "",
      // });
      // 跳转页面
      navigate("/activities");
    },
    onError: (error) => {
      if (error.status === 401) {
        // Token 过期或无效，清除并跳转到登录页
        useAuthStore.getState().logout();
        toast.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
    },
  });

  // part2: 编辑功能的实现---2.1从缓存中获取activity数据
  // 从ActivitiesPage点击view进入到ActivityDetailPage(会看到跳转的url是id的页面--然后ActivityDetailHeader页面点击manage event按钮)-点击这个按钮会跳转到manage/id页面(其实就是CreatePage.jsx页面)
  // 这个id就是activity.id, 也是ActivityPage页面中点击view传递的id到ActivityDetailPage页面的id,然后点击manage event按钮跳转到的id到CreatePage页面!!!!!!!!!!!!!
  // 所以这里选择用缓存, 不用再fetch数据了---当然可以重新获取这个id的activity数据, 但是没必要!!!!!
  const { id } = useParams();
  // console.log("CreatePage id param:", id);
  const isEditMode = !!id; // 有id就是编辑模式,没有id就是创建模式
  const { data: activity } = useQuery({
    queryKey: ["activities", id],
    queryFn: () => getActivity(id),
    // enabled: !!id, // 只有当 id 存在时才执行该查询--不用isEditMode这一变量也行,但是因为我后续的jsx中要用这个, 就定义了一个新的变量isEditMode
    enabled: isEditMode, // 只有编辑模式才执行查询
  });

  // part2: 编辑功能的实现---2.2把获取到的activity数据填充到表单中---编辑模式下填充form
  useEffect(() => {
    if (activity) {
      setForm({
        title: activity.title || "",
        description: activity.description || "",
        category: activity.category || "",
        date: activity.date
          ? format(new Date(activity.date), "yyyy-MM-dd")
          : "",
        venue: activity.venue || "",
        city: activity.city || "",
        latitude: activity.latitude || "",
        longitude: activity.longitude || "",
      });
    }
  }, [activity]);

  // 出现问题: 但点击view-进入这个页面(编辑模式下),再点击 "Create Activity" 后，会看到表单还有数据, 但是应该是空的
  // 从编辑页 /manage/123 → 点击导航栏 "CREATE ACTIVITY" → 跳转到 /create-activity ---组件复用了！（同一个 CreatePage 组件）----form 状态保留了！
  // ✅ 监听 id 变化，如果从编辑模式切换到创建模式，重置表单
  // 方法2: 另一个解决办法就是卸载--在定义路由的时候加一个 key 属性, 让 React 认为是不同的组件---但是这种方法不够优雅!!!!!!!!!!!
  useEffect(() => {
    if (!isEditMode) {
      // 创建模式：重置表单
      setForm({
        title: "",
        date: "",
        description: "",
        category: "",
        city: "",
        venue: "",
        latitude: "",
        longitude: "",
      });
    }
  }, [isEditMode]);

  // part2: 编辑功能的实现---2.3定义 updateMutation函数---发put请求更新一个 activity
  const updateActivityMutation = useMutation({
    mutationFn: ({ id, activity }) => updateActivity(id, activity),
    onSuccess: (result) => {
      toast.success(result.message);
      // 更新缓存
      queryClient.invalidateQueries(["activities"]);
      queryClient.invalidateQueries(["activities", id]);
      // 跳转页面
      navigate(`/activities/${id}`);
    },
  });

  // 提交表单
  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ 在提交前验证(验证逻辑放这里)
    const { title, description, category, date, venue } = form;
    if (!title || !description || !category || !date || !venue) {
      toast.error("Please fill in all fields.");
      return; // 验证失败,不执行后续代码
    }
    // console.log("formdate 的值:", form.date);
    const formattedDate = new Date(form.date).toISOString();
    if (isEditMode) {
      // 编辑模式---这个是更新,put请求
      // console.log("Updated activity data:", { ...form, date: formattedDate });
      updateActivityMutation.mutate({
        id,
        activity: { ...form, date: formattedDate },
      });
    } else {
      // 创建模式---这个是新建,post请求
      createActivityMutation.mutate({ ...form, date: formattedDate });
    }
  };

  // part2: 编辑功能的实现---2.1权限校验---只有host才能编辑
  if (isEditMode && activity && !activity.isHost) {
    navigate(`/activities/${id}`);
    return null;
  }

  return (
    <Paper sx={{ borderRadius: 3, p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        {isEditMode ? "Edit Activity" : "Create Activity"}
      </Typography>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        gap={3}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={3}
          value={form.description}
          onChange={handleChange}
        />

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            name="category"
            label="Category"
            value={form.category}
            onChange={handleChange}
          >
            <MenuItem value={"drinks"}>Drinks</MenuItem>
            <MenuItem value={"culture"}>Culture</MenuItem>
            <MenuItem value={"film"}>Film</MenuItem>
            <MenuItem value={"music"}>Music</MenuItem>
            <MenuItem value={"travel"}>Travel</MenuItem>
            <MenuItem value={"food"}>Food</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <TextField
          label="Enter the location"
          name="venue"
          value={form.venue}
          onChange={handleChange}
        />
        {/* 显示建议列表 */}
        {suggestions.length > 0 && (
          <List>
            {suggestions.map((s) => (
              <ListItemButton
                key={s.place_id}
                onClick={() => handleSelectSuggestion(s)}
              >
                {s.display_name}
              </ListItemButton>
            ))}
          </List>
        )}

        <Box display="flex" justifyContent="end" gap={3}>
          <Button
            component={Link}
            to={isEditMode ? `/activities/${id}` : "/activities"}
            color="inherit"
          >
            Cancel
          </Button>
          <Button variant="contained" color="success" type="submit">
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
