import MasterStyle from "./master.module.scss";
import Entity from "../../Image/entity.png";
import Teams from "../../Image/teams.png";
import AngdiyaIcon from "../../Image/master/angadiaIcon.png";
import BankIcon from "../../Image/master/bankIcon.png";
import CustomersIcon from "../../Image/master/customersIcon.png";
import SupplierIcon from "../../Image/master/supplierIcon.png";
import TeamsIcon from "../../Image/master/teamsIcon.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { apisHeaders } from "../../common/apisHeaders";

export default function Master() {
  const navigate = useNavigate();
  const { loggedIn } = useSelector((state) => state.authData);
  const [entityArray, setEntityArray] = useState([
    {
      icon: CustomersIcon,
      title: "ગ્રાહક",
      count: 0,
      path: "/master/customers",
      type: "C",
    },
    {
      icon: SupplierIcon,
      title: "વેપારી",
      count: 0,
      path: "/master/suppliers",
      type: "S",
    },
    {
      icon: BankIcon,
      title: "બેન્ક",
      count: 0,
      path: "/master/banks",
      type: "B",
    },
    {
      icon: AngdiyaIcon,
      title: "આંગડિયા",
      count: 0,
      path: "/master/angadiya",
      type: "A",
    },
  ]);

  const [teamsArray, setTeamsArray] = useState([
    {
      icon: TeamsIcon,
      title: "ટીમ",
      count: 0,
      path: "/master/teams",
    },
    // {
    //   icon: TeamsIcon,
    //   title: "દુકાન ખર્ચ",
    //   count: 0,
    //   path: "/master/shopexpense",
    // },
  ]);

  useEffect(() => {
    if (loggedIn) {
      async function getcounts() {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_API}/master/getmasterscount`,
          { uId: loggedIn?._id },
          apisHeaders
        );
        // console.log("response--->", response);
        if (!response?.data?.error) {
          const teamCount = response.data.data.teamCount;
          const counts = response.data.data.entityCount;
          setTeamsArray([
            { ...teamsArray[0], count: teamCount },
            // { ...teamsArray[1], count: teamCount },
          ]);
          if (counts.length > 0) {
            const updatedEntityArray = entityArray.map((entity) => {
              const matchingCount = counts.find(
                (countObj) => countObj.type === entity.type
              );
              return {
                ...entity,
                count: matchingCount ? matchingCount.count : 0,
              };
            });

            // Update the state with the new array
            setEntityArray(updatedEntityArray);
          }
        }
      }
      getcounts();
    }
  }, [loggedIn]);
  return (
    <div className={MasterStyle.masterBox}>
      <div className={MasterStyle.mainBox}>
        <div className={MasterStyle.entityBox}>
          <div className={MasterStyle.titleBox}>
            <img src={Entity} alt="Entity" height={60} />
          </div>
          <div className={MasterStyle.tabs}>
            {entityArray.map((entity, index) => {
              return (
                <div className={MasterStyle.tabBox} key={index}>
                  <div className={MasterStyle.iconBox}>
                    <img src={entity.icon} alt={entity.icon} height={33} />
                  </div>
                  <h4>{entity.title}</h4>
                  <h3>{entity.count}</h3>
                  <button onClick={() => navigate(entity.path)}>View</button>
                </div>
              );
            })}
          </div>
        </div>
        <div className={MasterStyle.teamsBox}>
          <div className={MasterStyle.titleBox}>
            <img src={Teams} alt="Teams" height={60} />
          </div>
          <div className={MasterStyle.tabs}>
            {teamsArray.map((team, index) => {
              return (
                <div className={MasterStyle.tabBox} key={index}>
                  <div
                    className={`${MasterStyle.iconBox} ${MasterStyle.teamBox}`}
                  >
                    <img src={team.icon} alt={team.icon} height={33} />
                  </div>
                  <h4>{team.title}</h4>
                  <h3>{team.count}</h3>
                  <button onClick={() => navigate(team.path)}>View</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
