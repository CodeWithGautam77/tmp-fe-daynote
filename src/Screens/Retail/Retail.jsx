import { useDispatch, useSelector } from "react-redux";
import RetailStyle from "./Retail.module.scss";
import WrtiteRetailEntry from "./WrtiteRetailEntry";
import {
  deleteRetailEntry,
  getRetailEntrysByDate,
} from "../../apis/retailSlice";
import moment from "moment";
import { useEffect } from "react";
import LoadingSkeleton from "../../components/Skeleton/LoadingSkeleton";
import { useState } from "react";
import {
  convertGujaratiToEnglish,
  DeleteSweetAlert,
} from "../../common/common";
import BootstrapTooltip from "../../components/Tooltip";
import { Button, Typography } from "@mui/material";
import UpdateRetailEntry from "./UpdateRetailEntry";
import WriteSilakEntry from "./WriteSilakEntry";
import { getAllNotes } from "../../apis/noteSlice";
import AddEditNote from "../Note/AddEditNote";
import WriteCustSupEntry from "./WriteCustSupEntry";
import { Delete } from "@mui/icons-material";
import WriteRetailNotfoundEntry from "./WriteRetailNotfoundEntry";

export default function Retail() {
  const dispatch = useDispatch();

  const { loggedIn } = useSelector((state) => state.authData);
  const currentDate = useSelector((state) => state.date.currentDate);
  const {
    retailLoading,
    incomeCashAcc,
    incomeOnlineAcc,
    expenseCashAcc,
    incomeCashDayTotalAmt,
    incomeOnlineDayTotalAmt,
    expenseCashDayTotalAmt,
    expenseOnlineDayTotalAmt,
    expenseCardDayTotalAmt,
    previousCashEntry,
    todayCashEntry,
    bankData,
  } = useSelector((state) => state.retailData);
  const { notes } = useSelector((state) => state.noteData);

  const [showTotalAmount, setShowTotalAmount] = useState(false);
  const [calculatedValue, setCalculatedValue] = useState(null);
  const [oldData, setOldData] = useState([false, null]);
  const [openNoteDialog, setOpenNoteDialog] = useState([false, null]);
  const [openAutoSubmit, setOpenAutoSubmit] = useState([false, false]);
  const [firstCancelFunc, setFirstCancelFunc] = useState(null);
  const [secondCancelFunc, setSecondCancelFunc] = useState(null);
  const [forceData, setForceData] = useState(null);

  useEffect(() => {
    // console.log(moment(currentDate).format('YYYY-MM-DD'))
    if (loggedIn) {
      dispatch(
        getRetailEntrysByDate({
          uId: loggedIn?._id,
          date: moment(currentDate).format("YYYY-MM-DD"),
        })
      );
      dispatch(
        getAllNotes({
          uId: loggedIn?._id,
          date: moment(currentDate).format("YYYY-MM-DD"),
        })
      );
    }
  }, [currentDate, loggedIn]);

  const handeDelete = async (data) => {
    if (
      data.amount !== "" &&
      data.amount !== null &&
      data.amount !== undefined &&
      data._id
    ) {
      const response = () => dispatch(deleteRetailEntry({ id: data._id }));
      DeleteSweetAlert({
        title: "Are you sure you want to delete this entry?",
        icon1: "warning",
        title2: `${data.amount} ${data.text ? data.text : ""} `,
        text: "Entry deleted successfully",
        icon2: "success",
        callApi: response,
        setOldData: () => setOldData([false, null]),
      });
    }
  };

  const handleShowTotal = () => {
    setShowTotalAmount(true);
    setTimeout(() => {
      // setShowAmount(false);
      setShowTotalAmount(false);
    }, 3000); // Hide the amount after 3 seconds
  };

  const handelAmtInput = (event) => {
    const value = event.target.textContent;
    if (value) {
      const translatedValue = convertGujaratiToEnglish(value);
      const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
      if (isNumeric) {
        const filteredArray = incomeCashAcc.filter(
          (item) => item.amount !== "" && item.amount !== null
        );

        // Get the last object from the filtered array
        const lastObjectWithAmount = filteredArray[filteredArray.length - 1];
        const calValue = Number(translatedValue) - lastObjectWithAmount?.amount;
        setCalculatedValue(calValue);
      }
    } else {
      setCalculatedValue(null);
    }
  };

  const handleWriteUpdateData = (data) => {
    if (oldData[1]?._id !== data?._id) {
      if (
        data.amount !== "" &&
        data.amount !== null &&
        data.amount !== undefined &&
        data._id
      ) {
        setForceData(null);
        setOldData([true, data]);
      }
    }
  };

  const handelSelectForceData = (data) => {
    const isSame = forceData?._id === data._id;

    if (isSame) {
      setForceData(null);
      return;
    } else {
      setOldData([false, null]);
      setForceData(data);
    }

    // const isValidData = data._id && data.entName && data.etype !== "CT";
    // const isValidEtype = !data.entryId;

    // if (isValidData && isValidEtype) {
    //   setForceData(data);
    // }
  };

  return (
    <>
      <div className={RetailStyle.main}>
        {/* <MasterMenu /> */}
        {retailLoading ? (
          <div className={RetailStyle.skeleton}>
            <div
              className={RetailStyle.incomeBox}
              style={{ width: "50%", margin: "1rem 0rem" }}
            >
              <LoadingSkeleton
                row={19}
                columns={1}
                width={"100%"}
                height={25}
                margin={".2rem .3rem"}
              />
              <LoadingSkeleton
                row={19}
                columns={1}
                width={"100%"}
                height={25}
                margin={".2rem .3rem"}
              />
              <LoadingSkeleton
                row={19}
                columns={1}
                width={"100%"}
                height={25}
                margin={".2rem .3rem"}
              />
            </div>
            <div
              className={RetailStyle.incomeBox}
              style={{ width: "50%", margin: "1rem 0rem" }}
            >
              <LoadingSkeleton
                row={19}
                columns={1}
                width={"100%"}
                height={25}
                margin={".2rem .3rem"}
              />
              <LoadingSkeleton
                row={19}
                columns={1}
                width={"100%"}
                height={25}
                margin={".2rem .3rem"}
              />
            </div>
          </div>
        ) : (
          <>
            {/* <div className={RetailStyle.calcuBox}>
            <WriteDivField
              handleInput={(e) => handelAmtInput(e)}
              customClass={RetailStyle.amtWriteInput}
              placeholder={"રકમ"}
              style={{width:"100%"}}
            />
            <div className={RetailStyle.minusText}>
              {calculatedValue ? calculatedValue : 0}
            </div>
          </div> */}
            <div className={RetailStyle.subMain}>
              {/* Income Box */}
              <div style={{ width: "50%" }}>
                <div
                  style={{
                    width: "100%",
                    border: "2px solid #950000",
                    borderRadius: ".5rem",
                    height: "fit-content",
                  }}
                >
                  {previousCashEntry && (
                    <div className={RetailStyle.previousCashEntryBox}>
                      <h5
                        className={"flex"}
                        style={{
                          fontSize: "14.7px",
                          height: "28px",
                          paddingLeft: ".2rem",
                        }}
                      >
                        {previousCashEntry?.amount}
                      </h5>
                      <h5
                        className={"flexCenter"}
                        style={{
                          width: "100%",
                          borderRight: "none",
                          fontSize: "14.7px",
                          height: "28px",
                          paddingRight: "2rem",
                        }}
                      >
                        {previousCashEntry?.text}
                      </h5>
                    </div>
                  )}
                  <div
                    style={{
                      width: "100%",
                      borderRadius: previousCashEntry
                        ? "0rem 0rem .5rem .5rem"
                        : ".5rem .5rem 0rem 0rem",
                    }}
                    className={RetailStyle.incomeBox}
                  >
                    {incomeCashAcc && incomeCashAcc?.length > 0 && (
                      <div style={{ width: "25%" }}>
                        <div
                          style={{
                            height: previousCashEntry ? "51vh" : "53.2vh",
                            overflowY: "scroll",
                          }}
                        >
                          {incomeCashAcc
                            ?.slice(0, Math.ceil(incomeCashAcc.length / 2))
                            ?.map((item, index) => {
                              return (
                                <BootstrapTooltip
                                  key={index}
                                  arrow
                                  title={
                                    <div key={index}>
                                      <Typography>{index + 1}</Typography>
                                      {item.text && (
                                        <>
                                          {(item.entryId ||
                                            item.isForceEntry) && (
                                            <div
                                              className="flex"
                                              onClick={() => handeDelete(item)}
                                            >
                                              <Delete
                                                sx={{ color: "red" }}
                                                fontSize="small"
                                              />
                                            </div>
                                          )}
                                          <Typography mt={1}>
                                            {item.text}{" "}
                                            {item.byWhom && `(${item.byWhom})`}
                                          </Typography>
                                        </>
                                      )}
                                    </div>
                                  }
                                  placement="right"
                                >
                                  <div
                                    className={RetailStyle.detialBox}
                                    key={index}
                                    onClick={() =>
                                      item.isForceEntry
                                        ? handelSelectForceData(item)
                                        : item.entryId
                                        ? () => {}
                                        : handleWriteUpdateData(item)
                                    }
                                    style={{
                                      backgroundColor: item.isForceEntry
                                        ? "yellow"
                                        : oldData[0] &&
                                          oldData[1]?._id === item._id
                                        ? "#d3d3d394"
                                        : "inherit",
                                    }}
                                  >
                                    <h5 className={RetailStyle.amtText}>
                                      {item.amount}
                                      {/* {!false ? item.amount : "XXXXX"} */}
                                    </h5>
                                  </div>
                                </BootstrapTooltip>
                              );
                            })}
                        </div>
                      </div>
                    )}
                    {incomeCashAcc && incomeCashAcc?.length > 0 && (
                      <div style={{ width: "25%" }}>
                        <div
                          style={{
                            height: previousCashEntry ? "51vh" : "53.2vh",
                            overflowY: "scroll",
                            borderLeft: "1px solid #950000",
                          }}
                        >
                          {incomeCashAcc
                            ?.slice(Math.ceil(incomeCashAcc.length / 2))
                            ?.map((item, index) => {
                              return (
                                <BootstrapTooltip
                                  key={index}
                                  arrow
                                  title={
                                    <div key={index}>
                                      <Typography>
                                        {Math.ceil(incomeCashAcc.length / 2) +
                                          index +
                                          1}
                                      </Typography>
                                      {item.text && (
                                        <>
                                          {(item.entryId ||
                                            item.isForceEntry) && (
                                            <div
                                              className="flex"
                                              onClick={() => handeDelete(item)}
                                            >
                                              <Delete
                                                sx={{ color: "red" }}
                                                fontSize="small"
                                              />
                                            </div>
                                          )}
                                          <Typography mt={1}>
                                            {item.text}{" "}
                                            {item.byWhom && `(${item.byWhom})`}
                                          </Typography>
                                        </>
                                      )}
                                    </div>
                                  }
                                  placement="right"
                                >
                                  <div
                                    className={RetailStyle.detialBox}
                                    key={index}
                                    onClick={() =>
                                      item.isForceEntry
                                        ? handelSelectForceData(item)
                                        : item.entryId
                                        ? () => {}
                                        : handleWriteUpdateData(item)
                                    }
                                    style={{
                                      backgroundColor: item.isForceEntry
                                        ? "yellow"
                                        : oldData[0] &&
                                          oldData[1]?._id === item._id
                                        ? "#d3d3d394"
                                        : "inherit",
                                    }}
                                  >
                                    <h5 className={RetailStyle.amtText}>
                                      {item.amount}
                                      {/* {!false ? item.amount : "XXXXX"} */}
                                    </h5>
                                  </div>
                                </BootstrapTooltip>
                              );
                            })}
                        </div>
                      </div>
                    )}
                    {incomeOnlineAcc && incomeOnlineAcc?.length > 0 && (
                      <div style={{ width: "25%" }}>
                        <div
                          style={{
                            height: previousCashEntry ? "51vh" : "53.2vh",
                            overflowY: "scroll",
                            borderLeft: "1px solid #950000",
                          }}
                        >
                          {incomeOnlineAcc
                            ?.slice(0, Math.ceil(incomeOnlineAcc.length / 2))
                            ?.map((item, index) => {
                              return (
                                <BootstrapTooltip
                                  key={index}
                                  arrow
                                  title={
                                    <div key={index}>
                                      <Typography>{index + 1}</Typography>
                                      {item.text && (
                                        <>
                                          {(item.entryId ||
                                            item.isForceEntry) && (
                                            <div
                                              className="flex"
                                              onClick={() => handeDelete(item)}
                                            >
                                              <Delete
                                                sx={{ color: "red" }}
                                                fontSize="small"
                                              />
                                            </div>
                                          )}
                                          <Typography mt={1}>
                                            {item.text}{" "}
                                            {item.byWhom && `(${item.byWhom})`}
                                          </Typography>
                                        </>
                                      )}
                                    </div>
                                  }
                                  placement="right"
                                >
                                  <div
                                    className={RetailStyle.detialBox}
                                    key={index}
                                    onClick={() =>
                                      item.isForceEntry
                                        ? handelSelectForceData(item)
                                        : item.entryId
                                        ? () => {}
                                        : handleWriteUpdateData(item)
                                    }
                                    style={{
                                      borderBottom: "1px solid #950000",
                                      // borderLeft: "1px solid #950000",
                                      // borderRight: "1px solid #950000",
                                      backgroundColor: item.isForceEntry
                                        ? "yellow"
                                        : oldData[0] &&
                                          oldData[1]?._id === item._id
                                        ? "#d3d3d394"
                                        : "inherit",
                                    }}
                                  >
                                    <h5 className={RetailStyle.amtText}>
                                      {item.amount}
                                    </h5>
                                  </div>
                                </BootstrapTooltip>
                              );
                            })}
                        </div>
                      </div>
                    )}
                    {incomeOnlineAcc && incomeOnlineAcc?.length > 0 && (
                      <div style={{ width: "25%" }}>
                        <div
                          style={{
                            height: previousCashEntry ? "51vh" : "53.2vh",
                            overflowY: "scroll",
                            borderLeft: "1px solid #950000",
                          }}
                        >
                          {incomeOnlineAcc
                            ?.slice(Math.ceil(incomeOnlineAcc.length / 2))
                            ?.map((item, index) => {
                              return (
                                <BootstrapTooltip
                                  key={index}
                                  arrow
                                  title={
                                    <div key={index}>
                                      <Typography>
                                        {Math.ceil(incomeOnlineAcc.length / 2) +
                                          index +
                                          1}
                                      </Typography>
                                      {item.text && (
                                        <>
                                          {(item.entryId ||
                                            item.isForceEntry) && (
                                            <div
                                              className="flex"
                                              onClick={() => handeDelete(item)}
                                            >
                                              <Delete
                                                sx={{ color: "red" }}
                                                fontSize="small"
                                              />
                                            </div>
                                          )}
                                          <Typography mt={1}>
                                            {item.text}{" "}
                                            {item.byWhom && `(${item.byWhom})`}
                                          </Typography>
                                        </>
                                      )}
                                    </div>
                                  }
                                  placement="right"
                                >
                                  <div
                                    className={RetailStyle.detialBox}
                                    key={index}
                                    onClick={() =>
                                      item.isForceEntry
                                        ? handelSelectForceData(item)
                                        : item.entryId
                                        ? () => {}
                                        : handleWriteUpdateData(item)
                                    }
                                    style={{
                                      borderBottom: "1px solid #950000",
                                      // borderLeft: "1px solid #950000",
                                      // borderRight: "1px solid #950000",
                                      backgroundColor: item.isForceEntry
                                        ? "yellow"
                                        : oldData[0] &&
                                          oldData[1]?._id === item._id
                                        ? "#d3d3d394"
                                        : "inherit",
                                    }}
                                  >
                                    <h5 className={RetailStyle.amtText}>
                                      {item.amount}
                                    </h5>
                                  </div>
                                </BootstrapTooltip>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-100 flex">
                    <div
                      className={RetailStyle.dTotalText}
                      onClick={handleShowTotal}
                      style={{
                        borderBottomLeftRadius: ".5rem",
                      }}
                    >
                      {showTotalAmount
                        ? `${incomeCashDayTotalAmt.toLocaleString()}/-`
                        : "XXXXX"}
                    </div>
                    <BootstrapTooltip
                      arrow
                      title={
                        <div>
                          {bankData && (
                            <Typography>
                              બેન્ક ટોટલ :&nbsp;
                              {bankData?.amount?.toLocaleString()}
                              /-
                            </Typography>
                          )}
                        </div>
                      }
                      placement="right"
                    >
                      <div
                        className={RetailStyle.dTotalText}
                        style={{
                          borderLeft: "1px solid #950000",
                          borderBottomRightRadius: ".5rem",
                        }}
                        onClick={handleShowTotal}
                      >
                        {showTotalAmount
                          ? `${incomeOnlineDayTotalAmt.toLocaleString()}/-`
                          : "XXXXX"}

                        {/* {incomeOnlineDayTotalAmt.toLocaleString()} */}
                      </div>
                    </BootstrapTooltip>
                  </div>
                </div>

                <div className={RetailStyle.incomeFinalTotalBox}>
                  <WriteSilakEntry />
                  <div
                    className={RetailStyle.incomeFinalTotal}
                    onClick={handleShowTotal}
                  >
                    <div style={{ fontSize: ".8rem" }}>Total</div>
                    {showTotalAmount
                      ? `${(
                          incomeCashDayTotalAmt + incomeOnlineDayTotalAmt
                        ).toLocaleString()}/-`
                      : "XXXXX"}
                  </div>
                </div>
              </div>

              {/* Note & Expense Box */}
              <div
                style={{
                  width: "50%",
                }}
              >
                <div
                  className={RetailStyle.noteBox}
                  style={{
                    width: "100%",
                    border: "2px solid #950000",
                    borderRadius: ".5rem",
                    height: "28.3vh",
                    marginBottom: ".5rem",
                  }}
                >
                  <div className={`flex ${RetailStyle.noteHeader}`}>
                    <div className={`flexCenter ${RetailStyle.noteDataBox}`}>
                      <b> ચિઠ્ઠી</b>
                    </div>
                    <Button
                      className="submitBtn"
                      variant="contained"
                      style={{ minWidth: "30%" }}
                      size="small"
                      onClick={() => setOpenNoteDialog([true, null])}
                    >
                      Add New
                    </Button>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      borderRadius: ".5rem",
                    }}
                    className={RetailStyle.expenseBox}
                  >
                    {notes && notes?.length > 0 && (
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            minHeight: "24.6vh",
                            maxHeight: "24.6vh",
                            overflowY: "scroll",
                          }}
                        >
                          {notes?.map((item, index) => {
                            return (
                              <BootstrapTooltip
                                key={index}
                                arrow
                                title={
                                  <div key={index}>
                                    <Typography>{index + 1}</Typography>
                                  </div>
                                }
                                placement="right"
                              >
                                <div
                                  className={RetailStyle.noteDataBox}
                                  key={index}
                                  onClick={() =>
                                    setOpenNoteDialog([true, item])
                                  }
                                >
                                  <h5 className={RetailStyle.exAmtText}>
                                    {item.amount}
                                  </h5>
                                  <h5 className={RetailStyle.nameText}>
                                    {item.name}
                                  </h5>
                                  <h5 className={RetailStyle.typeText}>
                                    {moment(item.date).format("DD-MM")}
                                  </h5>
                                </div>
                              </BootstrapTooltip>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    border: "2px solid #950000",
                    borderRadius: ".5rem",
                    maxHeight: "fit-content",
                    minHeight: "fit-content",
                  }}
                >
                  {todayCashEntry && (
                    <divt className={RetailStyle.previousCashEntryBox}>
                      <h5
                        className={"flex"}
                        style={{
                          fontSize: "14.7px",
                          height: "28px",
                          paddingLeft: ".2rem",
                        }}
                      >
                        {todayCashEntry?.amount}
                      </h5>
                      <h5
                        className={"flexCenter"}
                        style={{
                          width: "100%",
                          borderRight: "none",
                          fontSize: "14.7px",
                          height: "28px",
                          paddingRight: "2rem",
                        }}
                      >
                        {todayCashEntry?.text}
                      </h5>
                    </divt>
                  )}
                  <div
                    style={{
                      width: "100%",
                      borderRadius: todayCashEntry
                        ? "0rem 0rem .5rem .5rem"
                        : ".5rem",
                    }}
                    className={RetailStyle.expenseBox}
                  >
                    {expenseCashAcc && expenseCashAcc?.length > 0 && (
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            minHeight: todayCashEntry ? "21.9vh" : "24.4vh",
                            maxHeight: todayCashEntry ? "21.9vh" : "24.4vh",
                            overflowY: "scroll",
                          }}
                        >
                          {expenseCashAcc?.map((item, index) => {
                            const types = {
                              C: "Cash",
                              O: "Online",
                              K: "Card",
                            };
                            return (
                              <BootstrapTooltip
                                key={index}
                                arrow
                                title={
                                  <div key={index}>
                                    <Typography>{index + 1}</Typography>
                                    {(item.entryId || item.isForceEntry) && (
                                      <div
                                        className="flex"
                                        onClick={() => handeDelete(item)}
                                      >
                                        <Delete
                                          sx={{ color: "red" }}
                                          fontSize="small"
                                        />
                                      </div>
                                    )}
                                  </div>
                                }
                                placement="right"
                              >
                                <div
                                  className={RetailStyle.detialBox}
                                  key={index}
                                  onClick={() =>
                                    item.isForceEntry
                                      ? handelSelectForceData(item)
                                      : item.entryId
                                      ? () => {}
                                      : handleWriteUpdateData(item)
                                  }
                                  style={{
                                    backgroundColor: item.isForceEntry
                                      ? "yellow"
                                      : oldData[0] &&
                                        oldData[1]?._id === item._id
                                      ? "#d3d3d394"
                                      : "inherit",
                                  }}
                                >
                                  <h5 className={RetailStyle.exAmtText}>
                                    {item.amount}
                                  </h5>
                                  <h5 className={RetailStyle.nameText}>
                                    {item.text}{" "}
                                    {item.byWhom && `(${item.byWhom})`}
                                  </h5>
                                  <h5 className={RetailStyle.typeText}>
                                    {types[item.type]}
                                  </h5>
                                </div>
                              </BootstrapTooltip>
                            );
                          })}
                        </div>
                        <div
                          className={RetailStyle.exTotalText}
                          onClick={handleShowTotal}
                        >
                          <div className={RetailStyle.totalAmtBox}>
                            <div style={{ fontSize: ".8rem" }}>Cash</div>
                            {showTotalAmount
                              ? `${expenseCashDayTotalAmt?.toLocaleString()}/-`
                              : "XXXXX"}
                          </div>
                          <BootstrapTooltip
                            arrow
                            title={
                              <div>
                                {bankData && (
                                  <Typography>
                                    બેન્ક ટોટલ :&nbsp;
                                    {bankData?.amount?.toLocaleString()}
                                    /-
                                  </Typography>
                                )}
                              </div>
                            }
                            placement="right"
                          >
                            <div className={RetailStyle.totalAmtBox}>
                              <div style={{ fontSize: ".8rem" }}>Online</div>
                              {showTotalAmount
                                ? `${expenseOnlineDayTotalAmt?.toLocaleString()}/-`
                                : "XXXXX"}
                            </div>
                          </BootstrapTooltip>

                          {/* <div className={RetailStyle.totalAmtBox}>
                        <div style={{ fontSize: ".8rem" }}>Card</div>
                        {showTotalAmount
                          ? `${expenseCardDayTotalAmt?.toLocaleString()}/-`
                          : "XXXXX"}
                      </div> */}
                          <div className={RetailStyle.finalTotalAmtBox}>
                            <div style={{ fontSize: ".8rem" }}>Total</div>
                            {showTotalAmount
                              ? `${(
                                  expenseCashDayTotalAmt +
                                  expenseOnlineDayTotalAmt +
                                  expenseCardDayTotalAmt
                                ).toLocaleString()}/-`
                              : "XXXXX"}
                            {/* {showTotalAmount
                        ? `${expenseDayTotalAmt.toLocaleString()}/-`
                        : "XXXXX"} */}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <div className={RetailStyle.writingGrp}>
          {oldData[0] && oldData[1] ? (
            <UpdateRetailEntry
              oldData={oldData[1]}
              setOldData={setOldData}
              handeDelete={handeDelete}
            />
          ) : forceData ? (
            <WriteRetailNotfoundEntry
              forceData={forceData}
              setForceData={setForceData}
            />
          ) : (
            <>
              <WriteCustSupEntry
                setOpenAutoSubmit={setOpenAutoSubmit}
                openAutoSubmit={openAutoSubmit}
                setFirstCancelFunc={setFirstCancelFunc}
                secondCancelFunc={secondCancelFunc}
              />
              <WrtiteRetailEntry
                setOpenAutoSubmit={setOpenAutoSubmit}
                openAutoSubmit={openAutoSubmit}
                setSecondCancelFunc={setSecondCancelFunc}
                firstCancelFunc={firstCancelFunc}
              />
            </>
          )}
        </div>
      </div>
      {openNoteDialog[0] && (
        <AddEditNote
          openNoteDialog={openNoteDialog}
          setOpenNoteDialog={setOpenNoteDialog}
        />
      )}
    </>
  );
}
