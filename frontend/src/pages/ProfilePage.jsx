import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper, Avatar, Button } from "@mui/material";
import ProfileEdit from "../compoents/ProfileEdit.jsx";
import useAuthStore from "../store/useAuthStore";
import { getProfile, editProfile } from "../http";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { id: userId } = useParams();
  const { user: currentUser, token, login } = useAuthStore();

  const isCurrentUser = currentUser?.id === userId;
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || "",
    bio: currentUser?.bio || "",
    file: null,
  });

  const [preview, setPreview] = useState(currentUser?.imageUrl || "/images/defaultAvatar.png");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isCurrentUser) return;
        const data = await getProfile(userId);
        setFormData({
          displayName: data.displayName || "",
          bio: data.bio || "",
          file: null,
        });
        setPreview(data.imageUrl || "/images/defaultAvatar.png");
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchProfile();
  }, [userId, isCurrentUser]);

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

      if (isCurrentUser) {
        login({ ...currentUser, ...updatedProfile }, token);
        setPreview(updatedProfile.imageUrl || preview);
      }

      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 2 }}>
        {isEditing && isCurrentUser ? (
          <ProfileEdit
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            preview={preview}
            setPreview={setPreview}
            setIsEditing={setIsEditing}
            currentUser={currentUser}
          />
        ) : (
          <>
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
                  mb: 1,
                  border: "4px solid white",
                }}
              />
            </Box>

            <Typography variant="h6">{formData.displayName}</Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
              <Typography color="text.secondary">
                {formData.bio || "No bio yet"}
              </Typography>
            </Box>

            {isCurrentUser && (
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
