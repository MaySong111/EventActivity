import { Box, Button, Avatar, TextField } from "@mui/material";
import useAuthStore from "../store/useAuthStore";

export default function ProfileEdit({
  formData,
  setFormData,
  handleSubmit,
  preview,
  setPreview,
  setIsEditing,
}) {
  const { user: currentUser } = useAuthStore();

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ textAlign: "center", py: 3, mb: 3 }}>
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

        <Button component="label" variant="outlined">
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
      </Box>

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
        onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mb: 2 }}
        disabled={
          formData.displayName.trim() === currentUser.displayName &&
          formData.bio.trim() === (currentUser.bio || "") &&
          !formData.file
        }
      >
        Save
      </Button>

      <Button variant="outlined" fullWidth onClick={() => setIsEditing(false)}>
        Cancel
      </Button>
    </form>
  );
}
