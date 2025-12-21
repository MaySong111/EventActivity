import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ActivitiesPage from "./pages/ActivityPage";
import ActivityDetailPage from "./pages/ActivityDetailPage";
import CreateActivity from "./pages/CreatePage";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import { CssBaseline } from "@mui/material";
import Layout from "./compoents/Layout";
import { Toaster } from "react-hot-toast";
import RequireAuth from "./compoents/RequireAuth";
import NotFound from "./pages/public/NotFound";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<RequireAuth />}>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetailPage />} />
            <Route path="/create-activity" element={<CreateActivity />} />
            <Route path="/edit/:id" element={<CreateActivity />} />
            <Route path="/profiles/:id" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// 父路由 element={<Navbar />} 是一个"布局组件"
// 子路由的内容需要渲染在父组件的某个位置
// <Outlet /> 就是告诉 React Router："把子路由渲染在这里"
