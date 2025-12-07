// pages/public/Login.jsx
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch("https://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error("登录失败");
      return response.json();
    },
    onSuccess: (data) => {
      // 存 Token 到 localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.userInfo));

      // 跳转到活动页面
      navigate("/activities");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    loginMutation.mutate({
      email: formData.get("email"),
      password: formData.get("password"),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField name="email" label="Email" />
      <TextField name="password" label="Password" type="password" />
      <Button type="submit">Login</Button>
      {loginMutation.isError && <Typography color="error">登录失败</Typography>}
    </form>
  );
}
