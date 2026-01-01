import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Avatar,
  Typography,
  Paper,
} from "@mui/material";

import useAuthStore from "../store/useAuthStore";
import { getProfile, editProfile } from "../http";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { id: userId } = useParams();
  const { user: currentUser, token, login } = useAuthStore();

  const isCurrentUser = currentUser?.id === userId;

  const [profileUser, setProfileUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    file: null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(userId);
        setProfileUser(data);
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
  }, [userId]);

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

      setProfileUser(updatedProfile);
      setIsEditing(false);

      // !only update auth store if current user edited their own profile
      if (isCurrentUser) {
        login({ ...currentUser, ...updatedProfile }, token);
      }

      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!profileUser) return null;

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 2 }}>
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

          {isEditing && isCurrentUser && (
            <Button component="label" variant="outlined" sx={{ mb: 2 }}>
              Choose Photo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setFormData((p) => ({ ...p, file }));
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </Button>
          )}
        </Box>

        {isEditing && isCurrentUser ? (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Display Name"
              value={formData.displayName}
              onChange={(e) =>
                setFormData((p) => ({ ...p, displayName: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={(e) =>
                setFormData((p) => ({ ...p, bio: e.target.value }))
              }
              sx={{ mb: 2 }}
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
              Save
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <>
            <Typography variant="h6">{profileUser.displayName}</Typography>
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary">
                {profileUser.bio || "No bio yet"}
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
