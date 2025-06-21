import { Typography } from "@mui/material";
import BootstrapTooltip from "../Tooltip";
import MasterMenuStyle from "./MasterMenu.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";

export default function MasterMenu({ routes }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={MasterMenuStyle.menuBox}>
      {routes?.map((item, index) => {
        return (
          <React.Fragment key={index}>
            {item.isShowinMenuBar && (
              <BootstrapTooltip
                key={index}
                arrow
                title={
                  <div key={index}>
                    <Typography>{item.title}</Typography>
                  </div>
                }
              >
                <div
                  className={MasterMenuStyle.tabBox}
                  key={index}
                  style={{
                    border:
                      item.path === location.pathname
                        ? // location.pathname.includes(item.path)
                          "3px solid #950000"
                        : "3px solid transparent",
                  }}
                >
                  <div
                    className={MasterMenuStyle.iconBox}
                    onDoubleClick={() => navigate(item.path)}
                  >
                    <img
                      src={item.iconWhite}
                      alt={item.iconWhite}
                      height={28}
                    />
                  </div>
                </div>
              </BootstrapTooltip>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
