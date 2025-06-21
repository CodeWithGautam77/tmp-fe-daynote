import { useLocation, useNavigate } from "react-router-dom";
import NavigaterStyle from "./navigater.module.scss";

export default function Navigater(props) {
  const { routes } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const currentRoute = routes.find((route) => route.path === location.pathname);
  const currentIcon = currentRoute ? currentRoute.iconWhite : "";

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className={NavigaterStyle.mainNavBar}>
      <div className={NavigaterStyle.bottomNavBar}>
        {routes.map(
          (route) =>
            route.path !== currentRoute.path && (
              <div
                key={route.path}
                className={NavigaterStyle.navItem}
                onClick={() => handleNavigate(route.path)}
              >
                <div
                  className={`${NavigaterStyle.icon} ${
                    NavigaterStyle[route.iconRed]
                  }`}
                ></div>
              </div>
            )
        )}

        <div className={`${NavigaterStyle.centralButton}`}>
          <div
            className={`${NavigaterStyle.icon} ${NavigaterStyle[currentIcon]}`}
          ></div>
        </div>
      </div>
    </div>
  );
}
