import { Event, FilterList } from "@mui/icons-material";
import {
  Box,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import useActivityStore from "../store/useActivityStore";

export default function ActivityFilters() {
  const filter = useActivityStore((state) => state.filter);
  const setFilter = useActivityStore((state) => state.setFilter);
  const startDate = useActivityStore((state) => state.startDate);
  const setStartDate = useActivityStore((state) => state.setStartDate);

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          borderRadius: 3,
        }}
      >
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                color: "primary.main",
              }}
            >
              <FilterList sx={{ mr: 1 }} />
              Filters
            </Typography>
            <MenuList>
              <MenuItem selected={!filter} onClick={() => setFilter("")}>
                <ListItemText primary="All Activities" />
              </MenuItem>
              <MenuItem
                selected={filter === "attending"}
                onClick={() => setFilter("attending")}
              >
                <ListItemText primary="I'm attending" />
              </MenuItem>
              <MenuItem
                selected={filter === "hosting"}
                onClick={() => setFilter("hosting")}
              >
                <ListItemText primary="I'm hosting" />
              </MenuItem>
            </MenuList>
          </Box>
        </Paper>
        <Box component={Paper} sx={{ width: "100%", p: 3, borderRadius: 3 }}>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              color: "primary.main",
            }}
          >
            <Event sx={{ mr: 1 }} />
            Select Date
          </Typography>
          <Calendar value={startDate} onChange={(date) => setStartDate(date)} />
        </Box>
      </Box>
    </div>
  );
}
