import { Link, useNavigate } from "react-router-dom";

// import { IconListCheck, IconMail, IconUser } from '@tabler/icons-react';

import ProfileImg from "../Image/user.png";
import LogoutIcon from "../Image/logoutIcon.png";
// import ZoomInIcon from "../Image/zoomInIcon.png";
// import ZoomOutIcon from "../Image/zoomOutIcon.png";
import phoneBookIcon from "../Image/phoneBookIcon.png";
import changePassIcon from "../Image/changePass.png";
import { removeAuthToken } from "../common/common";
import { useState } from "react";
import { Avatar, Box, Button, IconButton, Menu } from "@mui/material";

export default function Profile({ handleOpenPBook }) {
  const navigate = useNavigate();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [isFullScreen, setisFullScreen] = useState(false);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // const requestFullScreen = () => {
  //   if (!document.fullscreenElement) {
  //     document.documentElement.requestFullscreen().catch((err) => {
  //       console.error(
  //         `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
  //       );
  //     });
  //   }
  // };

  // const toggleFullScreen = () => {
  //   setisFullScreen((prev) => !prev);
  //   if (!document.fullscreenElement) {
  //     requestFullScreen();
  //   } else {
  //     if (document.exitFullscreen) {
  //       document.exitFullscreen();
  //     }
  //   }
  // };

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
          border: "1px solid #950000",
          bgcolor: "#fff",
          ...(typeof anchorEl2 === "object" &&
            {
              // color: "primary.main",
            }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 50,
            height: 50,
          }}
        />
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
          marginTop: ".5rem",
          "& .MuiMenu-paper": {
            width: "210px",
            borderRadius: "3px 25px 3px",
          },
        }}
      >
        <Box
          py={1}
          px={2}
          className="flexStart gap-05 cursurPointer"
          onClick={() => {
            handleOpenPBook();
            handleClose2();
          }}
        >
          <img src={phoneBookIcon} alt="ZoomIcon" height={25} />
          <h4>Phone Book</h4>
        </Box>
        <Box
          py={1}
          px={2}
          className="flexStart gap-05 cursurPointer"
          onClick={() => {
            navigate("/auth/changepassword");
            handleClose2();
          }}
        >
          <img src={changePassIcon} alt="LogoutIcon" height={20} />
          <h4 style={{ textWrap: "nowrap" }}>Change Passowrd</h4>
        </Box>
        <Box
          py={1}
          px={2}
          className="flexStart gap-05 cursurPointer"
          onClick={() => {
            removeAuthToken();
            navigate("/auth/login");
            handleClose2();
          }}
        >
          <img src={LogoutIcon} alt="LogoutIcon" height={20} />
          <h4>Log Out</h4>
        </Box>
      </Menu>
    </Box>
  );
}
