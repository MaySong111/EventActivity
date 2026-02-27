import { Link } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const { loginMutation } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // console.log("Current formData:", formData);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    // frontend validation
    const newErrors = {};
    const { email, password } = formData;
    if (!email) newErrors.email = "Email is required";
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) newErrors.password = "Password is required";

    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (password.toLowerCase() === password) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    loginMutation.mutate(
      {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      },
      {
        onError: (error) => {
          console.log("Login error:", error);
          if (error.message.toLowerCase().includes("email")) {
            setErrors((prev) => ({ ...prev, email: error.message }));
          } else if (error.message.toLowerCase().includes("password")) {
            setErrors((prev) => ({ ...prev, password: error.message }));
          } else {
            toast.error(error.message);
          }
        },
      },
    );
  };
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <LockOpenIcon sx={{ color: "secondary.main", fontSize: 40 }} />
          <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
            Sign in
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                color="primary"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loginMutation.isPending}
            sx={{ mt: 3, mb: 2 }}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account?
            <Link to="/register" variant="body2" sx={{ ml: 0.5 }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
