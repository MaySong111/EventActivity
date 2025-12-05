import { Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import HomePage from "./pages/HomePage";
import ActivitiesPage from "./pages/ActivityPage";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/activities/:id" element={<ActivitiesPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}
