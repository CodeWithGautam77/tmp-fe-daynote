import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import { addBillImages } from "../../apis/borrowSlice";
import ClickImageStyle from "./clickImage.module.scss";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

export default function ClickImage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const { borrowLoading } = useSelector((state) => state.borrowData);
  // const [state, setstate] = useState(initialState)

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment",
  };

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // console.log(imageSrc);

    const file = base64ToFile(imageSrc, "captured_image.jpg");
    const formData = new FormData();
    formData.append("file", file);
    const response = await dispatch(addBillImages({ id: id, formData }));
    if (!response.payload.error) {
      toast.success("Image added successfully");
    }
  };

  const base64ToFile = (base64String, fileName) => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };

  return (
    <div className={ClickImageStyle.main}>
      <Webcam
        audio={false}
        ref={webcamRef}
        height={800}
        screenshotFormat="image/jpeg"
        width={null}
        style={{ width: "100%" }}
        videoConstraints={videoConstraints}
      />
      {/* <button onClick={capture} className={ClickImageStyle.captureBtn}>
        Capture
      </button> */}
      <div className={ClickImageStyle.btnBox}>
        {borrowLoading ? (
          <CircularProgress sx={{ color: "#950000" }} size={75} />
        ) : (
          <div className={ClickImageStyle.captureBtn} onClick={capture}>
            <div className={ClickImageStyle.circle}></div>
            <div className={ClickImageStyle.ring}></div>
          </div>
        )}
      </div>
    </div>
  );
}
