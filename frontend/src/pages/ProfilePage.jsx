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
      const updated = await editProfile(data);

      setProfileUser(updated);
      setIsEditing(false);

      // !only update auth store if current user edited their own profile
      if (isCurrentUser) {
        login({ ...currentUser, ...updated }, token);
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
        <Typography variant="h4">Profile</Typography>
        <Box sx={{ textAlign: "center" }}>
          <Avatar
            src={preview}
            sx={{ width: 130, height: 130, mx: "auto", mb: 2 }}
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
            <Typography sx={{ mt: 2 }}>
              {profileUser.bio || "No bio yet"}
            </Typography>

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
