import { Box, Paper, TextField, Typography, Button } from "@mui/material";

export default function CreatePage() {
  // const [form, setForm] = useState({
  //   title: "",
  //   description: "",
  //   dateTime: "",
  //   location: "",
  // });
  return (
    <Paper sx={{ borderRadius: 3, p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Create New Activity
      </Typography>
      <Box component="form" display="flex" flexDirection="column" gap={3}>
        <TextField label="Title" name="title" />
        <TextField label="Description" name="description" multiline rows={3} />
        <TextField label="Category" />
        <TextField label="Date" type="date" />
        <TextField label="City" name="city" />
        <TextField label="Venue" name="venue" />
        <Box display="flex" justifyContent="end" gap={3}>
          <Button color="inherit">Cancel</Button>
          <Button variant="contained" color="success">
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
