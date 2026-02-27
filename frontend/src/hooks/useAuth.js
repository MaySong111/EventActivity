import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser } from "../http";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";

export default function useAuth() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (result) => {
      const { token, userInfo } = result;
      login(userInfo, token);
      navigate("/");
    },
  });

  return { registerMutation, loginMutation };
}
