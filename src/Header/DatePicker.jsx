import { Box, IconButton, Menu } from "@mui/material";
import React from "react";
import { CalendarToday } from "@mui/icons-material";
import { useState } from "react";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setDate } from "../apis/dateSlice";

export default function DatePicker() {
  const dispatch = useDispatch();
  const currentDate = useSelector((state) => state.date.currentDate);

  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleChangeDate = (value) => {
    dispatch(setDate(moment(value).format("YYYY-MM-DD")));
    setAnchorEl2(null);
  };

  return (
    <Box>
      <IconButton
        size="medium"
        // aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          padding: "0",
          bgcolor: "#fff",
          ...(typeof anchorEl2 === "object" &&
            {
              // color: "primary.main",
            }),
        }}
        onClick={handleClick2}
      >
        <CalendarToday fontSize="small" />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        elevation={0}
        sx={{
          marginTop: "2rem",
          "& .MuiMenu-paper": {
            width: "320px",
            border: "1px solid #950000",
            // borderRadius: "3px 25px 3px",
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateCalendar
            value={moment(currentDate)}
            onChange={(newValue) =>
              //   console.log(moment(newValue).format("YYYY-MM-DD"))
              handleChangeDate(newValue)
            }
          />
        </LocalizationProvider>
      </Menu>
    </Box>
  );
}
