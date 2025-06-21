import LongtermBorrowWriteEntry from "./LongtermBorrowWriteEntry";
import LongTermBorrowStyle from "./LongTermBorrow.module.scss";
import { useDispatch, useSelector } from "react-redux";
import LoadingSkeleton from "../../components/Skeleton/LoadingSkeleton";
import { useEffect } from "react";
import {
  deleteLongtermEntry,
  getAllLongtermBorrow,
  undoEntry,
} from "../../apis/longtermBorrowSlice";
import { Delete } from "@mui/icons-material";
import { DeleteSweetAlert, updateArrConvertToEng } from "../../common/common";
import BootstrapTooltip from "../../components/Tooltip";
import moment from "moment";
import { IconButton, Typography } from "@mui/material";
import EditLongtermBorrowEntry from "../Dailogs/EditLongtermBorrowEntry";
import { useState } from "react";
import TranslateIcon from "@mui/icons-material/Translate";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import ExportButton from "./DownloadExcel";

export default function LongTermBorrow() {
  const dispatch = useDispatch();

  const { loggedIn } = useSelector((state) => state.authData);
  const currentDate = useSelector((state) => state.date.currentDate);

  const { longtermBorrowLoading, longtermBorrow, dayTotalAmt } = useSelector(
    (state) => state.longtermBorrowData
  );

  const [showTotalAmount, setShowTotalAmount] = useState(true);

  const [openEditLongtermBorrowDialog, setOpenEditLongtermBorrowDialog] =
    useState([false, null]);
  const [convertedLongtermArr, setConvertedLongtermArr] = useState([]);

  useEffect(() => {
    if (loggedIn) {
      dispatch(
        getAllLongtermBorrow({
          uId: loggedIn?._id,
          date: moment(currentDate)?.format("YYYY-MM-DD"),
        })
      );
    }
  }, [loggedIn, currentDate]);

  useEffect(() => {
    setConvertedLongtermArr([]);
  }, [longtermBorrow]);

  // console.log(lastEntryOfMonth);
  // const midpoint = Math.ceil(longtermBorrow.length / 2);
  // const longtermBorrowFirstHalf = longtermBorrow.slice(0, midpoint);
  // const longtermBorrowSecondHalf = longtermBorrow.slice(midpoint);

  const handeDelete = async (data) => {
    if (data && data?._id) {
      const response = () => dispatch(deleteLongtermEntry(data));
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

  const handelOpenEditDailog = (data) => {
    if (
      data.entName &&
      data.amount !== null &&
      data.amount !== undefined &&
      data.amount !== ""
    ) {
      const findLongtermBorrowData = longtermBorrow.find(
        (item) => item._id === data._id
      );
      if (findLongtermBorrowData) {
        setOpenEditLongtermBorrowDialog([true, findLongtermBorrowData]);
      }
    }
  };

  const handleShowTotal = () => {
    setShowTotalAmount(false);
    setTimeout(() => {
      setShowTotalAmount(true);
    }, 3000); // Hide the amount after 3 seconds
  };

  const handelConvertToEng = (longtermData) => {
    if (convertedLongtermArr.length > 0) {
      setConvertedLongtermArr([]);
    } else {
      const updatedLongtermArr = updateArrConvertToEng(longtermData);
      setConvertedLongtermArr(updatedLongtermArr);
    }
  };

  const handelUndo = async () => {
    dispatch(
      undoEntry({
        uId: loggedIn?._id,
        date: moment(currentDate).format("YYYY-MM-DD"),
      })
    );
  };

  const finalLongtermArr =
    convertedLongtermArr.length > 0 ? convertedLongtermArr : longtermBorrow;
  const oneThird = Math.ceil(finalLongtermArr.length / 3);
  const longtermBorrowFirstPart = finalLongtermArr.slice(0, oneThird);
  const longtermBorrowSecondPart = finalLongtermArr.slice(
    oneThird,
    2 * oneThird
  );
  const longtermBorrowThirdPart = finalLongtermArr.slice(2 * oneThird);

  const filteredEntries = finalLongtermArr.filter(
    (entry) => entry.entName !== "" && entry.amount !== ""
  );

  const lastEntryOfMonth = filteredEntries.reduce((acc, item) => {
    const month = moment(item.createdAt).format("YYYY-MM");
    acc[month] = item; // Each new item in the same month will overwrite the previous one, leaving the last entry
    return acc;
  }, {});

  return (
    <div className={LongTermBorrowStyle.main}>
      {/* <div className={LongTermBorrowStyle.otherBtnGrp}>
        <IconButton
          size="small"
          className="btnRed"
          onClick={() => handelConvertToEng(longtermBorrow)}
        >
          <TranslateIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" className="btnRed" onClick={handelUndo}>
          <SettingsBackupRestoreIcon fontSize="small" />
        </IconButton>
      </div> */}
      <div className={LongTermBorrowStyle.otherBtnGrp}>
        <ExportButton
          longtermBorrow={longtermBorrow}
          longtermBorrowTotal={dayTotalAmt}
          date={currentDate ? moment(currentDate).format("DD-MM-YY") : null}
          page={"લાંબાગાળા ઉચક"}
        />
      </div>
      {longtermBorrowLoading ? (
        <div className={LongTermBorrowStyle.skeleton}>
          <div style={{ width: "33.33%", margin: "1rem 0rem" }}>
            <LoadingSkeleton
              row={18}
              columns={1}
              width={"100%"}
              height={25}
              margin={".2rem 0rem"}
            />
          </div>
          <div style={{ width: "33.33%", margin: "1rem 0rem" }}>
            <LoadingSkeleton
              row={18}
              columns={1}
              width={"100%"}
              height={25}
              margin={".2rem 0rem"}
            />
          </div>
          <div style={{ width: "33.33%", margin: "1rem 0rem" }}>
            <LoadingSkeleton
              row={18}
              columns={1}
              width={"100%"}
              height={25}
              margin={".2rem 0rem"}
            />
          </div>
        </div>
      ) : (
        <div className={LongTermBorrowStyle.subMain}>
          <div className={LongTermBorrowStyle.viewBox}>
            {/* --------------------------------------------- Temp Borrow Box ------------------------------------------ */}

            <div
              style={{
                width: "33.33%",
                maxHeight: "100%",
                overflowY: "scroll",
              }}
            >
              {longtermBorrowFirstPart &&
                longtermBorrowFirstPart?.length > 0 && (
                  <>
                    <div className={LongTermBorrowStyle.temBorrowBox}>
                      {longtermBorrowFirstPart?.map((item, index) => {
                        const isLastInMonth =
                          lastEntryOfMonth[
                            moment(item.createdAt).format("YYYY-MM")
                          ] === item;

                        // Calculate time difference in seconds
                        const timeDifferenceInSeconds =
                          (Date.now() - new Date(item.createdAt).getTime()) /
                          1000;
                        const isNewEntry = timeDifferenceInSeconds <= 30; // Within the last 20 seconds

                        return (
                          <div
                            className={LongTermBorrowStyle.detialBox}
                            key={index}
                            style={{
                              // borderBottom: "1px solid #950000", // Reset color for non-last occurrences
                              boxShadow: isLastInMonth
                                ? "inset 0em -4px #000000c9" // Apply thicker border for the last entry of the month
                                : "none",
                              overflowY: "scroll",
                            }}
                            onDoubleClick={() => handelOpenEditDailog(item)}
                          >
                            <h5
                              className={LongTermBorrowStyle.deletIcon}
                              onClick={() => handeDelete(item)}
                            >
                              <Delete
                                sx={{
                                  color:
                                    item.entName && item.amount
                                      ? "red"
                                      : "lightgray",
                                }}
                                fontSize="small"
                              />
                            </h5>

                            <h5
                              className={LongTermBorrowStyle.amtText}
                              style={{ width: "30%" }}
                            >
                              {item.amount !== null &&
                              item.amount !== undefined &&
                              item.amount !== ""
                                ? !false
                                  ? item.amount
                                  : "XXXXX"
                                : ""}
                            </h5>

                            <BootstrapTooltip
                              arrow
                              title={
                                item.createdAt ? (
                                  <div>
                                    <Typography>{index + 1}.</Typography>
                                    <Typography>
                                      {moment(item?.createdAt).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </Typography>
                                    <Typography>{item.entPhone}</Typography>
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
                                className={`${LongTermBorrowStyle.custText}`}
                                style={{
                                  fontSize: isNewEntry && "1.1rem",
                                  fontWeight: isNewEntry && "bolder",
                                }}
                              >
                                {item.entName} {item.entArea}
                                {isLastInMonth && (
                                  <Typography fontSize={".7rem"}>
                                    {moment(item.createdAt).format("MMMM YYYY")}
                                  </Typography>
                                )}
                              </h5>
                            </BootstrapTooltip>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
            </div>

            <div className={LongTermBorrowStyle.firstVerticalHr}></div>

            <div
              style={{
                width: "33.33%",
                maxHeight: "100%",
                overflowY: "scroll",
              }}
            >
              {longtermBorrowSecondPart &&
                longtermBorrowSecondPart?.length > 0 && (
                  <>
                    <div className={LongTermBorrowStyle.temBorrowBox}>
                      {longtermBorrowSecondPart?.map((item, index) => {
                        const isLastInMonth =
                          lastEntryOfMonth[
                            moment(item.createdAt).format("YYYY-MM")
                          ] === item;
                        // Calculate time difference in seconds
                        const timeDifferenceInSeconds =
                          (Date.now() - new Date(item.createdAt).getTime()) /
                          1000;
                        const isNewEntry = timeDifferenceInSeconds <= 30; // Within the last 20 seconds
                        return (
                          <div
                            className={LongTermBorrowStyle.detialBox}
                            key={index}
                            style={{
                              // borderBottom: "1px solid #950000", // Reset color for non-last occurrences
                              borderBottom: isLastInMonth
                                ? "3px solid black" // Apply thicker border for the last entry of the month
                                : "1px solid #950000",
                              overflowY: "scroll",
                            }}
                            onDoubleClick={() =>
                              setOpenEditLongtermBorrowDialog([true, item])
                            }
                          >
                            <h5
                              className={LongTermBorrowStyle.deletIcon}
                              onClick={() => handeDelete(item)}
                            >
                              <Delete
                                sx={{
                                  color:
                                    item.entName && item.amount
                                      ? "red"
                                      : "lightgray",
                                }}
                                fontSize="small"
                              />
                            </h5>

                            <h5
                              className={LongTermBorrowStyle.amtText}
                              style={{ width: "30%" }}
                            >
                              {item.amount !== null &&
                              item.amount !== undefined &&
                              item.amount !== ""
                                ? !false
                                  ? item.amount
                                  : "XXXXX"
                                : ""}
                            </h5>

                            <BootstrapTooltip
                              arrow
                              title={
                                item.createdAt ? (
                                  <div>
                                    <Typography>
                                      {longtermBorrowSecondPart?.length +
                                        index +
                                        1}
                                    </Typography>
                                    <Typography>
                                      {moment(item?.createdAt).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </Typography>
                                    <Typography>{item.entPhone}</Typography>
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
                                className={`${LongTermBorrowStyle.custText}`}
                                style={{
                                  fontSize: isNewEntry && "1.1rem",
                                  fontWeight: isNewEntry && "bolder",
                                }}
                              >
                                {item.entName} {item.entArea}
                                {isLastInMonth && (
                                  <Typography fontSize={".7rem"}>
                                    {moment(item.createdAt).format("MMMM YYYY")}
                                  </Typography>
                                )}
                              </h5>
                            </BootstrapTooltip>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
            </div>
            <div className={LongTermBorrowStyle.secondVerticalHr}></div>

            <div
              style={{
                width: "33.33%",
                maxHeight: "100%",
                overflowY: "scroll",
              }}
            >
              {longtermBorrowThirdPart &&
                longtermBorrowThirdPart?.length > 0 && (
                  <>
                    <div className={LongTermBorrowStyle.temBorrowBox}>
                      {longtermBorrowThirdPart?.map((item, index) => {
                        const isLastInMonth =
                          lastEntryOfMonth[
                            moment(item.createdAt).format("YYYY-MM")
                          ] === item;
                        // Calculate time difference in seconds
                        const timeDifferenceInSeconds =
                          (Date.now() - new Date(item.createdAt).getTime()) /
                          1000;
                        const isNewEntry = timeDifferenceInSeconds <= 30; // Within the last 20 seconds
                        return (
                          <div
                            className={LongTermBorrowStyle.detialBox}
                            key={index}
                            style={{
                              // borderBottom: "1px solid #950000", // Reset color for non-last occurrences
                              borderBottom: isLastInMonth
                                ? "3px solid black" // Apply thicker border for the last entry of the month
                                : "1px solid #950000",
                              overflowY: "scroll",
                            }}
                            onDoubleClick={() =>
                              setOpenEditLongtermBorrowDialog([true, item])
                            }
                          >
                            <h5
                              className={LongTermBorrowStyle.deletIcon}
                              onClick={() => handeDelete(item)}
                            >
                              <Delete
                                sx={{
                                  color:
                                    item.entName && item.amount
                                      ? "red"
                                      : "lightgray",
                                }}
                                fontSize="small"
                              />
                            </h5>

                            <h5
                              className={LongTermBorrowStyle.amtText}
                              style={{ width: "30%" }}
                            >
                              {item.amount !== null &&
                              item.amount !== undefined &&
                              item.amount !== ""
                                ? !false
                                  ? item.amount
                                  : "XXXXX"
                                : ""}
                            </h5>

                            <BootstrapTooltip
                              arrow
                              title={
                                item.createdAt ? (
                                  <div>
                                    <Typography>
                                      {longtermBorrowSecondPart?.length +
                                        longtermBorrowThirdPart?.length +
                                        index +
                                        1}
                                      .
                                    </Typography>
                                    <Typography>
                                      {moment(item?.createdAt).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </Typography>
                                    <Typography>{item.entPhone}</Typography>
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
                                className={`${LongTermBorrowStyle.custText}`}
                                style={{
                                  fontSize: isNewEntry && "1.1rem",
                                  fontWeight: isNewEntry && "bolder",
                                }}
                              >
                                {item.entName} {item.entArea}
                                {isLastInMonth && (
                                  <Typography fontSize={".7rem"}>
                                    {moment(item.createdAt).format("MMMM YYYY")}
                                  </Typography>
                                )}
                              </h5>
                            </BootstrapTooltip>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
            </div>
          </div>
          <div
            className={LongTermBorrowStyle.dTotalText}
            onClick={handleShowTotal}
          >
            {showTotalAmount ? "XXXX" : `${dayTotalAmt.toLocaleString()}/-`}
          </div>
        </div>
      )}
      <div className={LongTermBorrowStyle.writeBox}>
        <LongtermBorrowWriteEntry />
      </div>
      {openEditLongtermBorrowDialog[0] && (
        <EditLongtermBorrowEntry
          openEditLongtermBorrowDialog={openEditLongtermBorrowDialog}
          setOpenEditLongtermBorrowDialog={setOpenEditLongtermBorrowDialog}
        />
      )}
    </div>
  );
}
