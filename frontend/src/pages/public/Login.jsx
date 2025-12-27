import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../http";
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
import useStore from "../../store/useAuthStore";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const login = useStore((state) => state.login);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // console.log("Current formData:", formData);

  const loginMutation = useMutation({
    mutationFn: loginUser,

    onSuccess: (result) => {
      // console.log("Login successful:", result);
      const { token, userInfo } = result;
      login(userInfo, token);
      navigate("/activities");
    },
    onError: (error) => {
      if (error.message === "Login failed") {
        toast.error("Invalid email or password");
      } else {
        toast.error("Login failed. Please try again.");
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe,
    });
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
