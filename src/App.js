import "./App.css";
import Layout from "./Layout/Layout";
import Borrow from "./Screens/Borrow/Borrow";
import LongTermBorrow from "./Screens/LongTermBorrow/LongTermBorrow";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Master from "./Screens/Master/Master";

import borrowRedIcon from "./Image/red/borrowRed.png";
import longborrowRedIcon from "./Image/red/long-term-borrowRed.png";
import masterRedIcon from "./Image/red/masterRed.png";
import mainAccRedIcon from "./Image/red/mainAccRed.png";

import borrowWhiteIcon from "./Image/white/borrowWhite.png";
import longborrowWhiteIcon from "./Image/white/long-term-borrowWhite.png";
import masterWhiteIcon from "./Image/white/masterWhite.png";
import mainAccWhiteIcon from "./Image/white/mainAccWhite.png";
import Login from "./Screens/auth/Login";
import Customers from "./Screens/Master/Customer/Customers";
import Suppliers from "./Screens/Master/Supplier/Suppliers";
import Banks from "./Screens/Master/Bank/Banks";
import Angadiya from "./Screens/Master/Angadiya/Angadiya";
import TeamTable from "./Screens/Master/Team/TeamTable";
import Main from "./Screens/Main/Main";
import ClickImage from "./Screens/Borrow/ClickImage";
import { useDispatch, useSelector } from "react-redux";
import Retail from "./Screens/Retail/Retail";
import { useEffect, useState } from "react";
import { getUserByToken } from "./apis/authSlice";
import { removeAuthToken } from "./common/common";

import AngdiyaIcon from "./Image/master/angadiaIcon.png";
import BankIcon from "./Image/master/bankIcon.png";
import CustomersIcon from "./Image/master/customersIcon.png";
import SupplierIcon from "./Image/master/supplierIcon.png";
import TeamsIcon from "./Image/master/teamsIcon.png";
import ShopExpenseIcon from "./Image/shopExpense.png";
import { addUserCities } from "./apis/citySlice";
import { toast } from "react-toastify";
import ShopExpense from "./Screens/Master/ShopExpense/ShopExpense";
import FullScreenModel from "./components/FullScreenModel";
import ChangePassword from "./Screens/auth/ChangePassword";
import Admin from "./Admin/Admin";
import User from "./Admin/User/User";
import UploadExcel from "./Admin/UploadExcel/UploadExcel";

const routes = [
  // {
  //   path: "/",
  //   component: <Main />,
  //   iconRed: mainAccRedIcon,
  //   iconWhite: mainAccWhiteIcon,
  //   access: ["H"],
  // },
  // {
  //   path: "/",
  //   component: <Retail />,
  //   iconRed: mainAccRedIcon,
  //   iconWhite: mainAccWhiteIcon,
  //   access: ["R"],
  // },
  {
    path: "/borrow",
    component: <Borrow />,
    iconRed: borrowRedIcon,
    iconWhite: borrowWhiteIcon,
    access: ["H", "R"],
  },
  {
    path: "/longtermborrow",
    component: <LongTermBorrow />,
    iconRed: longborrowRedIcon,
    iconWhite: longborrowWhiteIcon,
    access: ["H"],
  },
  {
    path: "/master",
    component: <Master />,
    iconRed: masterRedIcon,
    iconWhite: masterWhiteIcon,
    access: ["H", "R"],
  },
  {
    path: "/master/customers/:id?",
    component: <Customers />,
    access: ["H", "R"],
    iconWhite: CustomersIcon,
  },
  {
    path: "/master/suppliers/:id?",
    component: <Suppliers />,
    access: ["H", "R"],
    iconWhite: SupplierIcon,
  },
  {
    path: "/master/banks/:id?",
    component: <Banks />,
    access: ["H", "R"],
    iconWhite: BankIcon,
  },
  {
    path: "/master/angadiya/:id?",
    component: <Angadiya />,
    access: ["H", "R"],
    iconWhite: AngdiyaIcon,
  },
  {
    path: "/master/teams/:id?",
    component: <TeamTable />,
    access: ["H", "R"],
    iconWhite: TeamsIcon,
  },
  {
    path: "/master/shopexpense/:id?",
    component: <ShopExpense />,
    access: ["H", "R"],
    iconWhite: ShopExpenseIcon,
  },
];

const masterMenu = [
  {
    path: "/",
    component: <Main />,
    // iconRed: mainAccRedIcon,
    iconWhite: mainAccWhiteIcon,
    access: ["H"],
    title: "રોજમેળ",
    isShowinMenuBar: true,
  },
  {
    path: "/",
    component: <Retail />,
    // iconRed: mainAccRedIcon,
    iconWhite: mainAccWhiteIcon,
    access: ["R"],
    title: "રોજમેળ",
    isShowinMenuBar: true,
  },
  {
    path: "/borrow",
    component: <Borrow />,
    // iconRed: borrowRedIcon,
    iconWhite: borrowWhiteIcon,
    access: ["H", "R"],
    title: "ઉધાર ખરીદ-વેચાણ",
    isShowinMenuBar: true,
  },
  {
    path: "/longtermborrow",
    component: <LongTermBorrow />,
    // iconRed: longborrowRedIcon,
    iconWhite: longborrowWhiteIcon,
    access: ["H"],
    title: "લાંબાગાળા ઉચક",
    isShowinMenuBar: true,
  },
  {
    path: "/master/banks",
    component: <Banks />,
    access: ["H", "R"],
    iconWhite: BankIcon,
    title: "બેન્ક",
    isShowinMenuBar: true,
  },
  {
    path: "/master/angadiya",
    component: <Angadiya />,
    access: ["H", "R"],
    iconWhite: AngdiyaIcon,
    title: "આંગડિયા",
    isShowinMenuBar: true,
  },
  {
    path: "/master/customers",
    component: <Customers />,
    access: ["H", "R"],
    iconWhite: CustomersIcon,
    title: "ગ્રાહક",
    isShowinMenuBar: true,
  },
  {
    path: "/master/suppliers",
    component: <Suppliers />,
    access: ["H", "R"],
    iconWhite: SupplierIcon,
    title: "વેપારી",
    isShowinMenuBar: true,
  },
  {
    path: "/master/teams",
    component: <TeamTable />,
    access: ["H", "R"],
    iconWhite: TeamsIcon,
    title: "ટીમ",
    isShowinMenuBar: true,
  },
  {
    path: "/master/shopexpense",
    component: <ShopExpense />,
    access: ["H", "R"],
    iconWhite: ShopExpenseIcon,
    title: "દુકાન ખર્ચ",
    isShowinMenuBar: true,
  },
  {
    path: "/master",
    component: <Master />,
    iconWhite: masterWhiteIcon,
    access: ["H", "R"],
    title: "માસ્ટર પેજ",
    isShowinMenuBar: true,
  },
];

const otherRoutes = [
  {
    path: "/borrow/:id",
    component: <ClickImage />,
  },
];

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { loggedIn } = useSelector((state) => state.authData);

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

  // const toggleFullScreen = () => {
  //   setisFullScreen((prev) => !prev);
  //   if (!document.fullscreenElement) {
  //     requestFullScreen();
  //   } else {
  //     if (document.exitFullscreen) {
  //       document.exitFullscreen();
  //     }
  //   }
  // };

  useEffect(() => {
    async function callAPI() {
      const response = await dispatch(getUserByToken());
      if (
        response.type.includes("rejected") &&
        response.payload.response.data.error
      ) {
        removeAuthToken();
        localStorage.removeItem("adminToken");
        if (pathname.includes("admin")) {
          navigate("/admin");
        } else {
          navigate("/auth/login");
        }
        toast.error("Time out");
      }
    }
    callAPI();
  }, []);

  const [filteredMenuRoutes, setFilteredMenuRoutes] = useState([]);

  useEffect(() => {
    if (loggedIn) {
      const filteredMenuRoutes = masterMenu.filter((r) =>
        r.access.includes(loggedIn?.type)
      );
      setFilteredMenuRoutes(filteredMenuRoutes);

      if (loggedIn?.userCities?.length > 0) {
        dispatch(addUserCities(loggedIn.userCities));
      }
    }
  }, [loggedIn]);

  const getMainScreenComponent = () => {
    if (!loggedIn) return <></>;
    if (loggedIn.type === "H") return <Main />;
    if (loggedIn.type === "R") return <Retail />;
    return <></>;
  };

  return (
    <>
      <FullScreenModel />
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/changepassword" element={<ChangePassword />} />
        <Route path="/admin" element={<Admin component={<User />} />} />
        <Route
          path="/admin/upload"
          element={<Admin component={<UploadExcel />} />}
        />
        {/* <Route path="*" element={<Login />} /> */}
        <Route
          path="/"
          element={
            <Layout
              component={getMainScreenComponent()}
              masterRoute={filteredMenuRoutes}
            />
          }
        />
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout
                component={route.component}
                masterRoute={filteredMenuRoutes}
              />
            }
          />
        ))}
        {otherRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout component={route.component} masterRoute={routes} />
            }
          />
        ))}
      </Routes>
    </>
  );
}

export default App;
