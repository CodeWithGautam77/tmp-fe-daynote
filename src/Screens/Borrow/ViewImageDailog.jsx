import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ViewImageDailog(props) {
  const { openViewImgDailog, setOpenViewImgDailog } = props;

  const handleCancel = () => {
    setOpenViewImgDailog([false, null]);
  };

  return (
    <React.Fragment>
      <Dialog
        open={openViewImgDailog[0]}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className="modalHeader">
          <h3 style={{ textTransform: "capitalize" }}>
            View Image In {openViewImgDailog[1]?.entName || openViewImgDailog[1]?.name}
            &nbsp;{openViewImgDailog[1]?.amount}
          </h3>
        </DialogTitle>
        <DialogContent className="modalContent">
          <div
            style={{
              width: "100%",
              marginBottom: ".5rem",
            }}
          >
            {/* <div> */}
            {openViewImgDailog[1]?.images?.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".8rem",
                }}
              >
                {openViewImgDailog[1].images.map((item, index) => {
                  return (
                    <div key={index}>
                      <h3>{index + 1})</h3>
                      <img
                        src={item.url}
                        alt="billimage"
                        style={{
                          border: "1px solid #950000",
                          maxWidth: "100%",
                          borderRadius: ".3rem",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>No Images</div>
            )}
            {/* </div> */}
          </div>
          <DialogActions className="flex">
            <Button
              variant="contained"
              onClick={handleCancel}
              className="cancelBtn"
            >
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
