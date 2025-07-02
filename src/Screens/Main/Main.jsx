import React, { useEffect, useState } from "react";
import WriteEntry from "./WriteEntry";
import ViewEntrysStyle from "./viewEntrys.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCashBAEntry,
  deleteEntry,
  getMainEntrysByDate,
  getTempBorrowEntrys,
  undoEntry,
} from "../../apis/mainSlice";
import moment from "moment";
import LoadingSkeleton from "../../components/Skeleton/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import { DeleteSweetAlert, updateArrConvertToEng } from "../../common/common";
import BootstrapTooltip from "../../components/Tooltip";
import { IconButton, Typography } from "@mui/material";
import EditTempBorrowEntry from "../Dailogs/EditTempBorrowEntry";
import TranslateIcon from "@mui/icons-material/Translate";
import WrtieNotfoundEntry from "./WrtieNotfoundEntry";
import WriteDebitBankAngadiaEntry from "./WriteDebitBankAngadiaEntry";
import WriteCreditBankAngadiaEntry from "./WriteCreditBankAngadiaEntry";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import WriteDebitAngadiaEntry from "./WriteDebitAngadiaEntry";
import ExportButton from "./DownloadExcel";
import ViewDebitBankEntrys from "./ViewDebitBankEntrys";
import ViewCreditDebitBAEntrys from "./ViewCreditDebitBAEntrys";

export default function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentDate = useSelector((state) => state.date.currentDate);
  const { loggedIn } = useSelector((state) => state.authData);
  const {
    mainscreenLoading,
    creditAcc,
    debitAcc,
    tempBorrow,
    creditDayTotalAmt,
    debitDayTotalAmt,
    tempBorrowTotalAmt,
  } = useSelector((state) => state.mainData);

  const [creditLastOccurrence, setCreditLastOccurrence] = useState({});
  const [debitLastOccurrence, setDebitLastOccurrence] = useState({});
  const [openEditTempBorrowDialog, setOpenEditTempBorrowDialog] = useState([
    false,
    null,
  ]);
  const [showTotalAmount, setShowTotalAmount] = useState(false);
  const [convertedCreditArr, setConvertedCreditArr] = useState([]);
  const [convertedDebitArr, setConvertedDebitArr] = useState([]);
  const [convertedTmpBorrowArr, setConvertedTmpBorrowArr] = useState([]);
  const [selectedBAid, setSelectedBAid] = useState(null);
  const [forceData, setForceData] = useState(null);
  const [selectedCreditBA, setSelectedCreditBA] = useState(null);
  const [selectedDebitA, setSelectedDebitA] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // console.log(moment(currentDate).format('YYYY-MM-DD'))
    if (loggedIn) {
      dispatch(
        getMainEntrysByDate({
          uId: loggedIn?._id,
          date: moment(currentDate).format("YYYY-MM-DD"),
        })
      );
      dispatch(
        getTempBorrowEntrys({
          uId: loggedIn?._id,
          date: moment(currentDate).format("YYYY-MM-DD"),
        })
      );
      setConvertedCreditArr([]);
      setConvertedDebitArr([]);
      setConvertedTmpBorrowArr([]);
      setSelectedBAid(null);
    }
  }, [currentDate, loggedIn]);

  let activeLock;
  useEffect(() => {
    activeLock = localStorage.setItem("screenLocked", "true");
  }, []);

  const handelConvertToEng = (creditData, debitData, tempBorrowData) => {
    if (
      convertedCreditArr.length > 0 &&
      convertedDebitArr.length > 0 &&
      convertedTmpBorrowArr.length > 0
    ) {
      setConvertedCreditArr([]);
      setConvertedDebitArr([]);
      setConvertedTmpBorrowArr([]);
    } else {
      const updatedCreditArr = updateArrConvertToEng(creditData);
      const updatedDebitArr = updateArrConvertToEng(debitData);
      const updatedTmpBorrowArr = updateArrConvertToEng(tempBorrowData);
      setConvertedCreditArr(updatedCreditArr);
      setConvertedDebitArr(updatedDebitArr);
      setConvertedTmpBorrowArr(updatedTmpBorrowArr);
    }
  };

  const handelEntryClick = (entryData) => {
    // console.log(entryData);
    if (entryData?.entityType && entryData.entryId) {
      const navigateData = {
        C: "/master/customers",
        S: "/master/suppliers",
        B: "/master/banks",
        A: "/master/angadiya",
        MR: "/master/teams",
        M: "/master/teams",
        SE: "/master/shopexpense",
      };
      if (navigateData[entryData?.entityType]) {
        const navigateTo = `${navigateData[entryData?.entityType]}/${
          entryData.entryId
        }`;
        navigate(navigateTo);
      } else if (entryData.type === "C") {
        const navigateTo = `${navigateData["C"]}/${entryData.entryId}`;
        navigate(navigateTo);
      } else if (entryData.type === "D") {
        const navigateTo = `${navigateData["S"]}/${entryData.entryId}`;
        navigate(navigateTo);
      }
    }
  };

  const handeDelete = async (data) => {
    // console.log(allKeysHaveValue);
    if (
      data._id &&
      data.uId &&
      // data.entryId &&
      data.amount &&
      data.type &&
      data.etype &&
      !["B", "A"].includes(data.etype)
    ) {
      // console.log("data", data);
      const response = () => dispatch(deleteEntry(data));
      DeleteSweetAlert({
        title: "Are you sure you want to delete this entry?",
        icon1: "warning",
        title2:
          data.etype === "MR"
            ? `${data.entName} ${data.amount} રજા`
            : `${data.entName} ${data.amount}`,
        text: "Entry deleted successfully",
        icon2: "success",
        callApi: response,
      });
    }
  };

  const handeDeleteBACashEntry = async (data) => {
    const response = () => dispatch(deleteCashBAEntry(data));
    DeleteSweetAlert({
      title: "Are you sure you want to delete this entry?",
      icon1: "warning",
      title2: `${data.entName} ${data.amount}`,
      text: "Entry deleted successfully",
      icon2: "success",
      callApi: response,
    });
  };

  const handelOpenEditDailog = (data) => {
    if (
      data.entName &&
      (data.amount !== null ||
        data.amount !== "" ||
        data.amount !== undefined) &&
      data.etype !== "CM" &&
      data.etype !== "DM"
    ) {
      const findTmpBorrowData = tempBorrow.find(
        (item) => item._id === data._id
      );
      if (findTmpBorrowData) {
        setOpenEditTempBorrowDialog([true, findTmpBorrowData]);
      }
    }
  };

  useEffect(() => {
    const calculateLastOccurrence = () => {
      const occurrenceMap = {};

      // Iterate over debitAcc and store the index of the last occurrence for each etype
      creditAcc.forEach((item, index) => {
        if ((item.entName && item.amount) || ["A", "B"].includes(item?.etype)) {
          // occurrenceMap[item.etype === "MR" ? "M" : item.etype] = index;
          occurrenceMap[
            item.etype === "MR"
              ? "M"
              : item.etype === "P" || item.etype === "R"
              ? "C"
              : item.etype
          ] = index;
        }
      });

      return occurrenceMap;
    };
    setCreditLastOccurrence(calculateLastOccurrence());
    setConvertedCreditArr([]);
    setConvertedDebitArr([]);
    setConvertedTmpBorrowArr([]);
  }, [creditAcc]);

  useEffect(() => {
    const calculateLastOccurrence = () => {
      const occurrenceMap = {};

      // Iterate over debitAcc and store the index of the last occurrence for each etype
      debitAcc.forEach((item, index) => {
        if ((item.entName && item.amount) || ["A", "B"].includes(item?.etype)) {
          occurrenceMap[
            item.etype === "MR"
              ? "M"
              : item.etype === "P" || item.etype === "R"
              ? "S"
              : item.etype
          ] = index;
        }
      });

      return occurrenceMap;
    };

    // Update the lastOccurrence state with the new map
    setDebitLastOccurrence(calculateLastOccurrence());
    setConvertedCreditArr([]);
    setConvertedDebitArr([]);
    setConvertedTmpBorrowArr([]);
  }, [debitAcc]);

  useEffect(() => {
    setConvertedCreditArr([]);
    setConvertedDebitArr([]);
    setConvertedTmpBorrowArr([]);
  }, [tempBorrow]);

  const colorMap = {
    M: "inset 0em -4px #000",
    S: "inset 0em -4px #000000c9",
    C: "inset 0em -4px #000000c9",
    // P: "inset 0em -4px #000000c9",
    // R: "inset 0em -4px #000000c9",
    B: "inset 0em -4px #000000ad",
    A: "inset 0em -4px #000000a6",
  };

  const handleShowTotal = () => {
    setShowTotalAmount(true);
    setTimeout(() => {
      setShowTotalAmount(false);
    }, 30000); // Hide the amount after 30 seconds
  };

  const handelSetBAid = (data) => {
    setForceData(null);
    setSelectedCreditBA(null);
    const isSameBAid = selectedBAid?._id === data._id;

    if (isSameBAid) {
      setSelectedBAid(null);
      return;
    }

    const isValidData = data._id && data.entName;
    const isValidEtype = data.etype === "A" || data.etype === "B";

    if (isValidData && isValidEtype) {
      setSelectedBAid(data);
    }
  };

  const handelSetCreditBAid = (data) => {
    setForceData(null);
    setSelectedBAid(null);
    setSelectedDebitA(null);
    const isSameBAid = selectedBAid?._id === data._id;

    if (isSameBAid) {
      setSelectedCreditBA(null);
      return;
    }

    const isValidData = data._id && data.entName;
    const isValidEtype = data.etype === "A" || data.etype === "B";

    if (isValidData && isValidEtype) {
      setSelectedCreditBA(data);
    }
  };

  const handelSetDebitAid = (data) => {
    setForceData(null);
    setSelectedBAid(null);
    setSelectedCreditBA(null);

    const isSameBAid = selectedDebitA?._id === data._id;

    if (isSameBAid) {
      setSelectedDebitA(null);
      return;
    }

    const isValidData = data._id && data.entName;
    const isValidEtype = data.etype === "A";

    if (isValidData && isValidEtype) {
      setSelectedDebitA(data);
    }
  };

  const handelSelectForceData = (data) => {
    const isSameBAid = selectedBAid?._id === data._id;

    if (isSameBAid) {
      setForceData(null);
      return;
    }

    const isValidData = data._id && data.entName && data.etype !== "CT";
    const isValidEtype = !data.entryId;

    if (isValidData && isValidEtype) {
      setForceData(data);
    }
  };

  //handle Undo----
  const handelUndo = async () => {
    dispatch(
      undoEntry({
        uId: loggedIn?._id,
        date: moment(currentDate).format("YYYY-MM-DD"),
      })
    );
  };

  const renderCreditData = (dataArray) => {
    return (
      <>
        <div className={ViewEntrysStyle.creditBox}>
          {dataArray?.map((item, index) => {
            const etypeKey =
              item.etype === "MR"
                ? "M"
                : item.etype === "P" || item.etype === "R"
                ? "C"
                : item.etype;

            const isLastOccurrence = creditLastOccurrence[etypeKey] === index;
            const boxShadowColor = colorMap[etypeKey] || "none";

            // Calculate time difference in seconds
            const timeDifferenceInSeconds =
              (Date.now() - new Date(item.createdAt).getTime()) / 1000;
            const isNewEntry = timeDifferenceInSeconds <= 30; // Within the last 20 seconds

            return (
              <div
                className={ViewEntrysStyle.detialBox}
                key={index}
                style={{
                  boxShadow: isLastOccurrence ? boxShadowColor : "none",
                }}
              >
                <h5
                  className={ViewEntrysStyle.deletIcon}
                  // onClick={() => handeDelete(item)}
                  onClick={() => {
                    if (
                      !item.entryId &&
                      item.baId &&
                      item.entName.includes("Cash")
                    ) {
                      handeDeleteBACashEntry({ ...item });
                    } else {
                      handeDelete(item);
                    }
                  }}
                >
                  <Delete
                    sx={{
                      color:
                        item.entName &&
                        item.amount &&
                        item.etype !== "CT" &&
                        !["B", "A"].includes(item.etype)
                          ? "red"
                          : "lightgray",
                    }}
                    fontSize="small"
                  />
                </h5>

                <h5 className={`${ViewEntrysStyle.amtText} flex`}>
                  {["A", "B"].includes(item.etype) && item.amount === 0
                    ? 0
                    : item.etype !== "MR" && item.etype !== "R" && item.amount
                    ? item.amount
                    : ""}
                </h5>

                {item.etype === "A" || item.etype === "B" ? (
                  <div className={`${ViewEntrysStyle.custText} flex`}>
                    <ViewCreditDebitBAEntrys
                      data={item}
                      handelSetDebitAid={handelSetCreditBAid}
                      handleShowTotal={handleShowTotal}
                      showTotalAmount={showTotalAmount}
                      etype={"S"}
                    />
                  </div>
                ) : (
                  <>
                    {/* Tooltip only if the first h5 condition is met */}
                    {!item.entryId &&
                    item.amount &&
                    item.etype !== "CT" &&
                    !item.entName.includes("Cash") ? (
                      <BootstrapTooltip
                        placement="right"
                        title={
                          <div>
                            <Typography>({index + 1})</Typography>
                            <Typography>
                              {item.entName}
                              {item.byWhom && <> ({item.byWhom})</>}
                            </Typography>
                            <Typography>
                              {moment(item?.createdAt).format("hh:mm A")}
                            </Typography>
                          </div>
                        }
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -14],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <h5
                          className={`${ViewEntrysStyle.custText} ${
                            !isNewEntry && "flex"
                          }`}
                          onClick={() => handelSelectForceData(item)}
                          style={{
                            fontSize: isNewEntry && "1.1rem",
                            fontWeight: isNewEntry && "bolder",
                            backgroundColor: "yellow",
                            boxShadow: isLastOccurrence
                              ? boxShadowColor
                              : "none",
                          }}
                        >
                          {item.entName} {item.byWhom && <> ({item.byWhom})</>}
                        </h5>
                      </BootstrapTooltip>
                    ) : (
                      <BootstrapTooltip
                        placement="right"
                        title={
                          <div>
                            <Typography>({index + 1})</Typography>
                            <Typography>
                              {item.etype === "MR"
                                ? `${item.entName} ${item.amount} રજા`
                                : item.etype === "P"
                                ? `${item.entName} ચૂકતે`
                                : item.etype === "R"
                                ? `${item.entName} ${item.amount} નેટ`
                                : item.entName}
                              {item.byWhom && <> ({item.byWhom})</>}
                            </Typography>
                            <Typography>
                              {moment(item?.createdAt).format("hh:mm A")}
                            </Typography>
                          </div>
                        }
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -14],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <h5
                          className={`${ViewEntrysStyle.custText} ${
                            !isNewEntry && "flex"
                          }`}
                          onDoubleClick={() => handelEntryClick(item)}
                          style={{
                            fontSize: isNewEntry && "1.1rem",
                            fontWeight: isNewEntry && "bolder",
                          }}
                        >
                          {item.etype === "MR"
                            ? `${item.entName} ${item.amount} રજા`
                            : item.etype === "P"
                            ? `${item.entName} ચૂકતે`
                            : item.etype === "R"
                            ? `${item.entName} ${item.amount} નેટ`
                            : item.entName}
                          {item.byWhom && <> ({item.byWhom})</>}
                        </h5>
                      </BootstrapTooltip>
                    )}

                    {/* Tooltip only if the second h5 condition is met */}
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div className={ViewEntrysStyle.dTotalText} onClick={handleShowTotal}>
          {showTotalAmount
            ? `${creditDayTotalAmt?.toLocaleString()}/-`
            : "XXXXX"}
        </div>
      </>
    );
  };

  //Debit Entry-----

  const renderDebitData = (dataArray) => {
    return (
      <>
        <div className={ViewEntrysStyle.debitBox}>
          {dataArray?.map((item, index) => {
            const etypeKey =
              item.etype === "MR"
                ? "M"
                : item.etype === "P" || item.etype === "R"
                ? "S"
                : item.etype;

            const isLastOccurrence = debitLastOccurrence[etypeKey] === index;
            const boxShadowColor = colorMap[etypeKey] || "none";
            // Calculate time difference in seconds
            const timeDifferenceInSeconds =
              (Date.now() - new Date(item.createdAt).getTime()) / 1000;
            const isNewEntry = timeDifferenceInSeconds <= 30; // Within the last 20 seconds

            return (
              <div
                className={ViewEntrysStyle.detialBox}
                key={index}
                style={{
                  boxShadow: isLastOccurrence ? boxShadowColor : "none",
                }}
              >
                <h5
                  className={ViewEntrysStyle.deletIcon}
                  // onClick={() => handeDelete(item)}
                  onClick={() => {
                    if (
                      !item.entryId &&
                      item.baId &&
                      item.entName.includes("Cash")
                    ) {
                      handeDeleteBACashEntry({ ...item });
                    } else {
                      handeDelete(item);
                    }
                  }}
                >
                  <Delete
                    sx={{
                      color:
                        item.entName &&
                        item.amount &&
                        item.etype !== "CT" &&
                        !["B", "A"].includes(item.etype)
                          ? "red"
                          : "lightgray",
                    }}
                    fontSize="small"
                  />
                </h5>

                <h5 className={`${ViewEntrysStyle.amtText} flex`}>
                  {["A", "B"].includes(item.etype) && item.amount === 0
                    ? 0
                    : item.etype !== "MR" && item.etype !== "R" && item.amount
                    ? item.amount
                    : ""}
                </h5>

                {item.etype === "A" || item.etype === "B" ? (
                  <>
                    {item.etype === "B" && (
                      <div className={`${ViewEntrysStyle.custText} flex`}>
                        <ViewDebitBankEntrys
                          data={item}
                          handelSetBAid={handelSetBAid}
                          handleShowTotal={handleShowTotal}
                          showTotalAmount={showTotalAmount}
                        />
                      </div>
                    )}
                    {item.etype === "A" && (
                      <div className={`${ViewEntrysStyle.custText} flex`}>
                        <ViewCreditDebitBAEntrys
                          data={item}
                          handelSetDebitAid={handelSetDebitAid}
                          handleShowTotal={handleShowTotal}
                          showTotalAmount={showTotalAmount}
                          etype={"C"}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <BootstrapTooltip
                    placement="right"
                    title={
                      <div>
                        <Typography>({index + 1})</Typography>
                        {!item.entryId &&
                        item.amount &&
                        item.etype !== "CT" &&
                        !item.entName.includes("Cash") ? (
                          <Typography>{item.entName}</Typography>
                        ) : (
                          <Typography>
                            {item.etype === "MR"
                              ? `${item.entName} ${item.amount} રજા`
                              : item.etype === "P"
                              ? `${item.entName} ચૂકતે`
                              : item.etype === "R"
                              ? `${item.entName} ${item.amount} નેટ`
                              : item.entName}{" "}
                            {item.byWhom && <> ({item.byWhom})</>}
                          </Typography>
                        )}
                        {/* {item.byWhom && <Typography>હસ્તે = {item.byWhom}</Typography>} */}
                        <Typography>
                          {moment(item?.createdAt).format("hh:mm A")}
                        </Typography>
                      </div>
                    }
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, -14],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    {!item.entryId &&
                    item.amount &&
                    item.etype !== "CT" &&
                    !item.entName.includes("Cash") ? (
                      <h5
                        className={`${ViewEntrysStyle.custText} ${
                          !isNewEntry && "flex"
                        }`}
                        onClick={() => handelSelectForceData(item)}
                        style={{
                          backgroundColor: "yellow",
                          boxShadow: isLastOccurrence ? boxShadowColor : "none",
                          fontSize: isNewEntry && "1.1rem",
                          fontWeight: isNewEntry && "bolder",
                        }}
                      >
                        {item.entName}
                      </h5>
                    ) : (
                      <h5
                        className={`${ViewEntrysStyle.custText} ${
                          !isNewEntry && "flex"
                        }`}
                        onDoubleClick={() => handelEntryClick(item)}
                        style={{
                          fontSize: isNewEntry && "1.1rem",
                          fontWeight: isNewEntry && "bolder",
                          // textWrap: "nowrap",
                          // overflowX: "auto",
                        }}
                      >
                        {item.etype === "MR"
                          ? `${item.entName} ${item.amount} રજા`
                          : item.etype === "P"
                          ? `${item.entName} ચૂકતે`
                          : item.etype === "R"
                          ? `${item.entName} ${item.amount} નેટ`
                          : item.entName}{" "}
                        {item.byWhom && <> ({item.byWhom})</>}
                      </h5>
                    )}
                  </BootstrapTooltip>
                )}
              </div>
            );
          })}
        </div>

        <div className={ViewEntrysStyle.dTotalText} onClick={handleShowTotal}>
          {showTotalAmount
            ? `${debitDayTotalAmt?.toLocaleString()}/-`
            : "XXXXX"}
        </div>
      </>
    );
  };

  //Tmp Borrow Entry-----

  const renderTmpBorrowData = (dataArray) => {
    return (
      <>
        <div className={ViewEntrysStyle.temBorrowBox}>
          {dataArray?.map((item, index) => {
            // Calculate time difference in seconds
            const timeDifferenceInSeconds =
              (Date.now() - new Date(item.createdAt).getTime()) / 1000;
            const isNewEntry = timeDifferenceInSeconds <= 30; // Within the last 20 seconds
            return (
              <div
                className={ViewEntrysStyle.detialBox}
                key={index}
                style={{
                  overflowY: "scroll",
                }}
                onDoubleClick={() => handelOpenEditDailog(item)}
              >
                <h5
                  className={`${ViewEntrysStyle.amtText} flex`}
                  style={{
                    width: "30%",
                    overflowY: "scroll",
                    paddingLeft: ".1rem",
                    color:
                      item.etype === "CM"
                        ? "green"
                        : item.etype === "DM"
                        ? "red"
                        : "",
                  }}
                >
                  {item.amount !== null ||
                  item.amount !== undefined ||
                  item.amount !== ""
                    ? !false
                      ? item.amount
                      : "XXXXX"
                    : ""}
                </h5>

                <BootstrapTooltip
                  placement="right"
                  title={
                    item.createdAt ? (
                      <div>
                        <Typography>({index + 1})</Typography>
                        <Typography>
                          {moment(item?.createdAt).format("DD-MM-YYYY hh:mm A")}
                        </Typography>
                        <Typography>{item?.entPhone}</Typography>
                      </div>
                    ) : null
                  }
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                >
                  <h5
                    className={`${ViewEntrysStyle.custText} `}
                    style={{
                      height: "28px",
                      textWrap: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      color:
                        item.etype === "CM"
                          ? "green"
                          : item.etype === "DM"
                          ? "red"
                          : "",
                      fontSize: isNewEntry && "1.1rem",
                      fontWeight: isNewEntry && "bolder",
                    }}
                  >
                    {item.entName} {item.entArea}
                  </h5>
                </BootstrapTooltip>
              </div>
            );
          })}
        </div>
        <div className={ViewEntrysStyle.dTotalText} onClick={handleShowTotal}>
          {showTotalAmount
            ? `${tempBorrowTotalAmt?.toLocaleString()}/-`
            : "XXXXX"}
        </div>
      </>
    );
  };

  //Screen Lock Handler---
  const toggleScreenLock = () => {
    setIsLocked(!isLocked);

    if (!isLocked) {
      localStorage.setItem("screenLocked", "true");
    } else {
      localStorage.setItem("screenLocked", "false");
    }
  };

  return (
    <div className={ViewEntrysStyle.superMain}>
      {/* <div className={ViewEntrysStyle.otherBtnGrp}>
        <IconButton
          size="small"
          className="btnRed"
          onClick={() => handelConvertToEng(creditAcc, debitAcc, tempBorrow)}
        >
          <TranslateIcon fontSize="small" />
        </IconButton>

        <IconButton size="small" className="btnRed" onClick={handelUndo}>
          <SettingsBackupRestoreIcon fontSize="small" />
        </IconButton>
      </div> */}
      <div className={ViewEntrysStyle.otherBtnGrp}>
        <ExportButton
          creditData={creditAcc}
          debitData={debitAcc}
          creditTotal={creditDayTotalAmt}
          debitTotal={debitDayTotalAmt}
          thirdData={tempBorrow}
          thirdTotal={tempBorrowTotalAmt}
          date={currentDate ? moment(currentDate).format("DD-MM-YY") : null}
          page={"રોજમેળ"}
        />
      </div>
      {mainscreenLoading ? (
        <div className={ViewEntrysStyle.skeleton}>
          <div style={{ width: "40%", margin: "1rem 0rem" }}>
            <LoadingSkeleton
              row={18}
              columns={1}
              width={"100%"}
              height={17}
              margin={".2rem 0rem"}
            />
          </div>

          <div style={{ width: "40%", margin: "1rem 0rem" }}>
            <LoadingSkeleton
              row={18}
              columns={1}
              width={"100%"}
              height={17}
              margin={".2rem 0rem"}
            />
          </div>

          <div style={{ width: "20%", margin: "1rem 0rem" }}>
            <LoadingSkeleton
              row={18}
              columns={1}
              width={"100%"}
              height={17}
              margin={".2rem 0rem"}
            />
          </div>
        </div>
      ) : (
        <>
          <div className={ViewEntrysStyle.subMain}>
            {/* --------------------------------------------- Credit Box ------------------------------------------ */}

            <div
              style={{ width: "40%", maxHeight: "100%", overflowY: "scroll" }}
            >
              {convertedCreditArr.length > 0
                ? renderCreditData(convertedCreditArr)
                : renderCreditData(creditAcc)}
            </div>
            <div className={ViewEntrysStyle.verticalHr}></div>

            {/* --------------------------------------------- Debit Box ------------------------------------------ */}

            <div
              style={{ width: "40%", maxHeight: "100%", overflowY: "scroll" }}
            >
              {convertedDebitArr.length > 0
                ? renderDebitData(convertedDebitArr)
                : renderDebitData(debitAcc)}
            </div>
            <div className={ViewEntrysStyle.verticalHr}></div>

            {/* --------------------------------------------- Temp Borrow Box ------------------------------------------ */}

            <div
              style={{ width: "20%", maxHeight: "100%", overflowY: "scroll" }}
            >
              {convertedTmpBorrowArr.length > 0
                ? renderTmpBorrowData(convertedTmpBorrowArr)
                : renderTmpBorrowData(tempBorrow)}
            </div>
          </div>
        </>
      )}
      {/* {forceData ? (
        <WrtieNotfoundEntry forceData={forceData} setForceData={setForceData} />
      ) : selectedBAid ? (
        <WriteDebitBankAngadiaEntry
          selectedBAid={selectedBAid}
          setSelectedBAid={setSelectedBAid}
          setForceData={setForceData}
        />
      ) : (
        <WriteEntry />
      )} */}

      {forceData ? (
        <WrtieNotfoundEntry forceData={forceData} setForceData={setForceData} />
      ) : selectedBAid ? (
        <WriteDebitBankAngadiaEntry
          selectedBAid={selectedBAid}
          setSelectedBAid={setSelectedBAid}
          setForceData={setForceData}
        />
      ) : selectedCreditBA ? (
        <WriteCreditBankAngadiaEntry
          selectedCreditBA={selectedCreditBA}
          setSelectedCreditBA={setSelectedCreditBA}
        />
      ) : selectedDebitA ? (
        <WriteDebitAngadiaEntry
          selectedDebitA={selectedDebitA}
          setSelectedDebitA={setSelectedDebitA}
        />
      ) : (
        <WriteEntry
          showTotalAmount={showTotalAmount}
          handleShowTotal={handleShowTotal}
        />
      )}

      {openEditTempBorrowDialog[0] && (
        <EditTempBorrowEntry
          openEditTempBorrowDialog={openEditTempBorrowDialog}
          setOpenEditTempBorrowDialog={setOpenEditTempBorrowDialog}
        />
      )}
    </div>
  );
}
