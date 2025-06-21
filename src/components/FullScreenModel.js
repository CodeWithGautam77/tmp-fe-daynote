import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: '.5rem'
};

export default function FullScreenModel() {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const requestFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      requestFullScreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setOpen(false)
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Full Screen?
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setOpen(false)}
            sx={{
                marginTop: '1rem',
                mr: '.5rem'
            }}
          >
            No
          </Button>
          <Button 
            variant="contained" 
            onClick={toggleFullScreen}
            sx={{
                marginTop: '1rem'
            }}
          >
            Yes
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
