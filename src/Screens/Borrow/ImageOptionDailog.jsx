import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { toast } from "react-toastify";
import { addBillImages } from "../../apis/borrowSlice";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ImageOptionDailog(props) {
  const { openImgOptDailog, setOpenImgOptDailog } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { borrowLoading } = useSelector((state) => state.borrowData);

  const handleCancel = () => {
    setOpenImgOptDailog([false, null]);
  };

  const handelUploadImage = async (e) => {
    const file = e.target.files[0];
    const maxSize = 3 * 1024 * 1024;
    console.log(file);
    // console.log(maxSize);
    if (file) {
      if (file.size > maxSize) {
        toast.error("Image size should not exceed 3MB.");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      const response = await dispatch(
        addBillImages({ id: openImgOptDailog[1]?._id, formData })
      );
      // console.log(response);
      if (!response.payload.error) {
        toast.success("Image added successfully");
      }
    }
  };

  const handelCliclPhotoBtn = () => {
    navigate(`/borrow/${openImgOptDailog[1]?._id}`);
  };

  return (
    <React.Fragment>
      <Dialog
        open={openImgOptDailog[0]}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle className="modalHeader">
          <h3 style={{ textTransform: "capitalize" }}>
            Add Image In {openImgOptDailog[1]?.entName}
            &nbsp;{openImgOptDailog[1]?.amount}
          </h3>
        </DialogTitle>
        <DialogContent className="modalContent">
          <div className="flexAround" style={{ marginBottom: ".5rem" }}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              className="submitBtn"
              disabled={borrowLoading}
            >
              Upload Image
              <VisuallyHiddenInput
                type="file"
                accept=".png,.jpg,.jpeg,.bmp"
                onChange={handelUploadImage}
              />
            </Button>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<PhotoCameraIcon />}
              color="secondary"
              onClick={handelCliclPhotoBtn}
            >
              CLick Photo
            </Button>
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
