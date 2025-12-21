import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function RequireAuth() {
  const token = useAuthStore((state) => state.token);
  // console.log("RequireAuth token:", token);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
