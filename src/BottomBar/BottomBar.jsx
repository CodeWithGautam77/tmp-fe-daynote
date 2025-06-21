import { useContext, useEffect } from "react";
import { RouteContext } from "../RouteContext";
import style from "./BottomBar.module.scss";
import logntermborrowRedIcon from "../Image/red/long-term-borrowRed.png";
import BorrowRedIcon from "../Image/red/borrowRed.png";
import { useLocation } from "react-router-dom";

const BottomBar = ({ routes }) => {
  const location = useLocation();
  const { setIndex, setIconIndex, index, lastAction, aniTime, iconIndex } =
    useContext(RouteContext);

  const current = iconIndex;
  const pre = iconIndex - 1;
  const next = iconIndex + 1;

  useEffect(() => {
    if (lastAction == "left") {
      addClass(["pre", "current", "next"], style.swipeLeft);

      setTimeout(() => {
        removeClass(["pre", "current", "next"], style.swipeLeft);
      }, aniTime);
    } else if (lastAction == "right") {
      addClass(["pre", "current", "next"], style.swipeRight);

      setTimeout(() => {
        removeClass(["pre", "current", "next"], style.swipeRight);
      }, aniTime);
    }
  }, [index]);

  useEffect(() => {
    routes.forEach((element, index) => {
      if (location.pathname.startsWith(element.path)) {
        setIndex(index);
        setIconIndex(index);
      }
    });
  }, []);

  const html = (
    <>
      <div className={style.sideBox} id="pre">
        <img
          src={routes[pre] ? routes[pre]?.iconRed : logntermborrowRedIcon}
          alt="Icon"
          style={{
            width: "1.5rem",
            height: "1.5rem",
          }}
        />
      </div>

      <div className={style.currentBox}>
        <img
          src={routes[current]?.iconWhite}
          alt="Icon"
          style={{
            width: "3rem",
            height: "3rem",
          }}
          id="current"
        />
      </div>

      <div className={style.sideBox} id="next">
        <img
          src={routes[next] ? routes[next]?.iconRed : BorrowRedIcon}
          alt="Icon"
          style={{
            width: "1.5rem",
            height: "1.5rem",
          }}
        />
      </div>
    </>
  );

  const addClass = (ele, className) => {
    ele?.map((data) => {
      const eleClass = document.getElementById(data);
      eleClass?.classList?.add(className);
    });
  };

  const removeClass = (ele, className) => {
    ele?.map((data) => {
      const eleClass = document.getElementById(data);
      eleClass?.classList?.remove(className);
    });
  };

  // if (window.location.pathname.startsWith("/auth")) {
  //   return null;
  // }

  return (
    <div className={style.BottomBarBox}>
      <div className={style.innerBox}>{html}</div>
    </div>
  );
};

export default BottomBar;
