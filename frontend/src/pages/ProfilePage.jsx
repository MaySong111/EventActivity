import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Container,
} from "@mui/material";
import ProfileEdit from "../compoents/ProfileEdit.jsx";
import ProfileTabs from "../compoents/ProfileTabs.jsx";
import AboutTab from "../compoents/AboutTab.jsx";
import ActivitiesTab from "../compoents/ActivitiesTab.jsx";
import StatisticsTab from "../compoents/StatisticsTab.jsx";
import useAuthStore from "../store/useAuthStore";
import { getProfile, editProfile } from "../http";
import useActivities from "../hooks/useActivities";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { id: userId } = useParams();
  const { user: currentUser, token, login } = useAuthStore();
  const isOwnProfile = currentUser?.id === userId;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    file: null,
  });
  const [preview, setPreview] = useState("/images/defaultAvatar.png");

  // 获取 Profile 数据
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isOwnProfile) {
          setFormData({
            displayName: currentUser?.displayName || "",
            bio: currentUser?.bio || "",
            file: null,
          });
          setPreview(currentUser?.imageUrl || "/images/defaultAvatar.png");
        } else {
          const data = await getProfile(userId);
          setFormData({
            displayName: data.displayName || "",
            bio: data.bio || "",
            file: null,
          });
          setPreview(data.imageUrl || "/images/defaultAvatar.png");
        }
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchProfile();
  }, [userId, isOwnProfile, currentUser]);

  // 获取活动数据
  const { myActivities, userHostedActivities } = useActivities();

  // 根据是否是自己的 Profile 选择数据源
  const activitiesData = isOwnProfile ? myActivities : userHostedActivities;

  // 计算统计数据（只计算一次，传递给所有需要的组件）
  let statistics = null;
  if (isOwnProfile && myActivities) {
    const now = new Date();
    const total = myActivities.length;
    const hosting = myActivities.filter(
      (a) => a.hostId === currentUser.id
    ).length;
    const attending = total - hosting;
    const upcoming = myActivities.filter((a) => new Date(a.date) > now).length;
    const past = total - upcoming;
    statistics = { total, hosting, attending, upcoming, past };
  }
  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.displayName.trim()) {
      toast.error("Display name is required");
      return;
    }

    const data = new FormData();
    data.append("displayName", formData.displayName);
    data.append("bio", formData.bio);
    if (formData.file) data.append("file", formData.file);

    try {
      const updatedProfile = await editProfile(data);
      setIsEditing(false);

      if (isOwnProfile) {
        login({ ...currentUser, ...updatedProfile }, token);
        setPreview(updatedProfile.imageUrl || preview);
      }

      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Tab 配置
  const tabs = [
    {
      label: "ABOUT",
      component: <AboutTab profile={formData} statistics={statistics} />,
    },
    {
      label: "ACTIVITIES",
      component: (
        <ActivitiesTab
          activities={activitiesData}
          isOwnProfile={isOwnProfile}
        />
      ),
    },
    // Statistics Tab 只在自己的 Profile 显示
    ...(isOwnProfile
      ? [
          {
            label: "STATISTICS",
            component: <StatisticsTab statistics={statistics} />,
          },
        ]
      : []),
  ];

  return (
    <Box sx={{ bgcolor: "#eeeeee", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          {/* 编辑模式 */}
          {isEditing && isOwnProfile ? (
            <ProfileEdit
            
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              preview={preview}
              setPreview={setPreview}
              setIsEditing={setIsEditing}
            />
          ) : (
            <>
              {/* 用户信息区域 */}
              <Box
                sx={{
                  textAlign: "center",
                  py: 3,
                  mb: 3,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Avatar
                  src={preview}
                  sx={{
                    width: 140,
                    height: 140,
                    mx: "auto",
                    mb: 2,
                    border: "4px solid white",
                    boxShadow: 3,
                  }}
                />
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {formData.displayName}
                </Typography>

                {/* 编辑按钮 - 仅本人可见 */}
                {isOwnProfile && (
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>

              {/* Tabs 区域 */}
              <ProfileTabs tabs={tabs} />
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
