import { useDispatch, useSelector } from "react-redux";
import HeaderStyle from "./header.module.scss";
import moment from "moment";
import { nextDate, previousDate, setDate } from "../apis/dateSlice";
import LeftWhiteArrow from "../Image/white/leftWhiteArrow.png";
import RightWhiteArrow from "../Image/white/rightWhiteArrow.png";
import Profile from "./Profile";
import { useEffect, useState } from "react";
import WriteDivField from "../components/WriteDivField";
import PhoneBookDailog from "../Screens/phoneBook/PhoneBookDailog";
import DatePicker from "./DatePicker";
import { Box } from "@mui/material";
import ZoomInIcon from "../Image/zoomInIcon.png";
import ZoomOutIcon from "../Image/zoomOutIcon.png";
import ReplayIcon from "@mui/icons-material/Replay";

export default function Header() {
  const dispatch = useDispatch();
  const currentDate = useSelector((state) => state.date.currentDate);

  const [openPhoneBookDialog, setOpenPhoneBookDialog] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleNextDate = () => {
    dispatch(nextDate());
  };

  const handlePreviousDate = () => {
    dispatch(previousDate());
  };

  const handleCurrentDate = () => {
    dispatch(setDate(moment().format()));
  };

  const [godname, setGodname] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isFullScreen, setisFullScreen] = useState(false);

  useEffect(() => {
    // Retrieve godname from local storage if available
    const storedGodname = localStorage.getItem("godname");
    if (storedGodname) {
      setGodname(storedGodname);
    } else {
      localStorage.setItem("godname", "|| શ્રી ગણેશાય નમઃ ||");
    }
  }, []);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setGodname(e.target.textContent);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Save the updated godname to local storage
    localStorage.setItem("godname", godname);
  };

  const handleOpenPBook = () => {
    setOpenPhoneBookDialog(true);
  };

  useEffect(() => {
    // Define event handlers to update state based on network status changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners for online and offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  //For Full Scrren-----

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
    setisFullScreen((prev) => !prev);
    if (!document.fullscreenElement) {
      requestFullScreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <>
      {/* <div className={HeaderStyle.dateBox}>
        <div className={HeaderStyle.dateBtn} onClick={handlePreviousDate}>
          <img src={LeftWhiteArrow} alt="LeftArrow" />
        </div>
        <div className={HeaderStyle.cDateBox}>
          <h3 className={HeaderStyle.currentDate} onClick={handleCurrentDate}>
            {moment(currentDate)?.format("DD-MM-YY")}
          </h3>
          <h5 className={HeaderStyle.currentDay} onClick={handleCurrentDate}>
            {moment(currentDate)?.format("dddd")}
          </h5>
        </div>
        <div className={HeaderStyle.dateBtn} onClick={handleNextDate}>
          <img src={RightWhiteArrow} alt="RightArrow" />
        </div>
      </div> */}
      {/* <h3>{isOnline ? "Connected" : "Disconnected"}</h3> */}
      <div className={`${HeaderStyle.header}`}>
        <div className={`${HeaderStyle.profileBox} ${HeaderStyle.fixedWidth}`}>
          <Profile handleOpenPBook={handleOpenPBook} />

          <Box
            py={1}
            // px={1}
            ml={2}
            className="flexStart gap-05 cursurPointer"
            onClick={() => {
              toggleFullScreen();
            }}
          >
            <img
              src={isFullScreen ? ZoomInIcon : ZoomOutIcon}
              alt="ZoomIcon"
              height={30}
            />
          </Box>
          <Box
            py={1}
            // px={1}
            ml={2}
            className="flexStart gap-05 cursurPointer"
            onClick={() => {
              window.location.reload();
            }}
          >
            <ReplayIcon style={{ fontSize: '2.5rem', color: "#800000" }} />
          </Box>
        </div>
        <div className={`${HeaderStyle.godNameBox}`}>
          {isEditing ? (
            <WriteDivField
              customClass={HeaderStyle.godNameInput}
              handleInput={handleInputChange}
              handleBlur={handleBlur}
            />
          ) : (
            <h1
              onDoubleClick={handleDoubleClick}
              className={`${HeaderStyle.godName} gradient-text`}
            >
              {godname}
            </h1>
          )}
        </div>
        <div className={`${HeaderStyle.dateBox} ${HeaderStyle.fixedWidth}`}>
          <div className={HeaderStyle.dateBtn} onClick={handlePreviousDate}>
            <img src={LeftWhiteArrow} alt="LeftArrow" />
          </div>
          <div className={HeaderStyle.cdateGrp}>
            <div className={HeaderStyle.cDateBox}>
              <h3
                className={HeaderStyle.currentDate}
                onClick={handleCurrentDate}
              >
                {moment(currentDate)?.format("DD-MM-YY")}
              </h3>
              <h5
                className={HeaderStyle.currentDay}
                onClick={handleCurrentDate}
              >
                {moment(currentDate)?.format("dddd")}
              </h5>
            </div>
            <DatePicker />
          </div>
          <div className={HeaderStyle.dateBtn} onClick={handleNextDate}>
            <img src={RightWhiteArrow} alt="RightArrow" />
          </div>
        </div>
      </div>
      {/* <div className={`${HeaderStyle.profileBox} flexCenter`}>
        <Profile />
      </div> */}
      <PhoneBookDailog
        openPhoneBookDialog={openPhoneBookDialog}
        setOpenPhoneBookDialog={setOpenPhoneBookDialog}
      />
    </>
  );
}
