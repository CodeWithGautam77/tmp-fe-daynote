import { useNavigate, Navigate } from "react-router-dom";
import LayoutStyle from "./layout.module.scss";
import { useSwipeable } from "react-swipeable";
import { useContext, useEffect, useState } from "react";
import { RouteContext } from "../RouteContext";
import "../App.css";
import Header from "../Header/Header";
import { getToken } from "../common/common";
import MasterMenu from "../components/Mastermenu/MasterMenu";
import Swal from "sweetalert2";

export default function Layout(props) {
  const { component, masterRoute } = props;

  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // const { index, handleSwipeLeft, handleSwipeRight } = useContext(RouteContext);

  // const handlers = useSwipeable({
  //   onSwipedRight: () => {
  //     const lockStatus = localStorage.getItem("screenLocked");
  //     // console.log(lockStatus, "333333333")

  //     if (index > 0 && true) {
  //       handleSwipeRight(masterRoute);
  //       navigate(masterRoute[index - 1].path);
  //     }
  //   },

  //   onSwipedLeft: () => {
  //     const lockStatus = localStorage.getItem("screenLocked");

  //     if (index < masterRoute.length - 1 && true) {
  //       handleSwipeLeft(masterRoute);
  //       navigate(masterRoute[index + 1].path);
  //     }
  //   },
  //   delta: 130, // minimum distance required for a swipe
  // });

  useEffect(() => {
    // Define event handlers
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      Swal.fire({
        title: "No Internet Connection",
        text: "Please check your internet connection",
        icon: "error",
        showConfirmButton: false,
      });
    } else {
      Swal.close();
    }
  }, [isOnline]);

  return (
    <>
      {!getToken().error ? (
        <>
          {isOnline ? (
            <div className="App">
              <Header />
              <div className={LayoutStyle.layoutBox}>
                <MasterMenu routes={masterRoute} />

                {component}
              </div>
            </div>
          ) : (
            <div className="App">
              <p>No Internet Connection</p>
            </div>
          )}
        </>
      ) : (
        <Navigate to={"/auth/login"} />
      )}
    </>
  );
}
