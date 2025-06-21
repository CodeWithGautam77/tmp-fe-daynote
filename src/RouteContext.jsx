import React, { createContext, useState } from "react";

export const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
  const [index, setIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);
  const [lastAction, setLastAction] = useState(null);

  const [aniTime, setAniTime] = useState(1000);

  const handleSwipeLeft = (routes) => {
    setLastAction("left");

    if (index < routes.length - 1) {
      setIndex(index + 1);
      setTimeout(() => {
        setIconIndex(index + 1);
      }, aniTime);
    }
  };

  const handleSwipeRight = (routes) => {
    setLastAction("right");

    if (index > 0) {
      setIndex(index - 1);
      setTimeout(() => {
        setIconIndex(index - 1);
      }, aniTime);
    }
  };

  const value = {
    index,
    setIndex,
    setIconIndex,
    handleSwipeLeft,
    handleSwipeRight,
    lastAction,
    aniTime,
    iconIndex,
  };

  return (
    <RouteContext.Provider value={value}>{children}</RouteContext.Provider>
  );
};
