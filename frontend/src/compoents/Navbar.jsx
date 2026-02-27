import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { Group } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import useActivityStore from "../store/useActivityStore";

const pages = [
  { label: "ACTIVITIES", path: "/activities" },
  { label: "CREATE ACTIVITY", path: "/create-activity" },
];

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoginedIn = !!token;

  const setFilter = useActivityStore((state) => state.setFilter);
  const setStartDate = useActivityStore((state) => state.setStartDate);
  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Group sx={{ height: 40, width: 40 }} />
        {/* leftside nav */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {pages.map((page) => (
            <Button
              key={page.label}
              component={Link}
              to={`${page.path}`}
              color="inherit"
              onClick={() => {
                setFilter("");
                setStartDate(null);
              }}
            >
              {page.label}
            </Button>
          ))}
        </Box>

        {/* rightside login : user menu */}
        {isLoginedIn ? (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            {/*  username */}
            <Typography>{currentUser.displayName}</Typography>
            {/* user avatar */}
            <Avatar
              src={currentUser.imageUrl}
              alt={currentUser?.displayName}
              sx={{ cursor: "pointer" }}
            />

            {/* dropdown menu */}
            {showMenu && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  boxShadow: 3,
                  minWidth: 150,
                  zIndex: 1000,
                  overflow: "hidden",
                }}
              >
                <Button
                  component={Link}
                  to={`/profiles/${currentUser.id}`}
                  sx={{
                    justifyContent: "flex-start",
                    width: "100%",
                    px: 2,
                    py: 1.5,
                    color: "text.primary",
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <PersonIcon sx={{ mr: 1 }} /> My Profile
                </Button>
                <Button
                  onClick={logout}
                  sx={{
                    justifyContent: "flex-start",
                    width: "100%",
                    px: 2,
                    py: 1.5,
                    color: "text.primary",
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
            <Button component={Link} to="/register" color="inherit">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}