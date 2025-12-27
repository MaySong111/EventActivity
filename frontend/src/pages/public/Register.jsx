import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../http";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Paper,
  Link,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // 注册 mutation
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      // 注册成功后，跳转到登录页面
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    },
    onError: (error) => {
      if (error.message.includes("Email is already in use")) {
        setErrors("Email is already in use");
        toast.error("Email is already in use. Please use a different email.");
      } else {
        setErrors("Registration failed");
        toast.error("Registration failed. Please try again.");
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const displayName = formData.get("displayName");
    const password = formData.get("password");

    // 前端验证
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!displayName) newErrors.displayName = "Display name is required";
    if (!password) newErrors.password = "Password is required";

    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 前端验证通过，调用注册 mutation
    registerMutation.mutate({
      email: formData.get("email"),
      displayName: formData.get("displayName"), // 注意字段名
      password: formData.get("password"),
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
            Register
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* Email 字段 */}
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email}
          />
          {/* Display name 字段 */}
          <TextField
            fullWidth
            margin="normal"
            name="displayName"
            label="Display name"
            autoComplete="username"
            error={!!errors.displayName}
            helperText={errors.displayName}
          />
          {/* Password 字段 */}
          <TextField
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={registerMutation.isPending}
            sx={{ mt: 3, mb: 2 }}
          >
            {registerMutation.isPending ? "Registering..." : "REGISTER"}
          </Button>

          {/* Already have an account? Sign in 链接 */}
          <Typography variant="body2" align="center">
            Already have an account?
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
              sx={{ ml: 0.5 }}
            >
              Sign in
            </Link>
          </Typography>

          {/* 错误信息 */}
          {registerMutation.isError && (
            <Typography color="error" align="center" sx={{ mt: 1 }}>
              {registerMutation.error.message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
