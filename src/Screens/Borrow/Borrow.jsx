import { useDispatch, useSelector } from "react-redux";
import BorrowStyle from "./borrow.module.scss";
import BorrowWriteEntry from "./BorrowWriteEntry";
import LoadingSkeleton from "../../components/Skeleton/LoadingSkeleton";
import { Delete } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import {
  deleteBorrowEntry,
  getBorrowEntrysByDate,
  undoEntry,
} from "../../apis/borrowSlice";
import moment from "moment";
import { DeleteSweetAlert, updateArrConvertToEng } from "../../common/common";
import { useNavigate } from "react-router-dom";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ImageOptionDailog from "./ImageOptionDailog";
import ViewImageDailog from "./ViewImageDailog";
import BootstrapTooltip from "../../components/Tooltip";
import { IconButton, Typography } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import WrtieBorrowNotfoundEntry from "./WrtieBorrowNotfoundEntry";
import ExportButton from "./DownloadExcel";

export default function Borrow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openImgOptDailog, setOpenImgOptDailog] = useState([false, null]);
  const [openViewImgDailog, setOpenViewImgDailog] = useState([false, null]);
  const clickTimeout = useRef(null);
  const isDoubleClick = useRef(false);

  const [showTotalAmount, setShowTotalAmount] = useState(false);
  const [convertedBuyAccArr, setConvertedBuytArr] = useState([]);
  const [convertedSellArr, setConvertedSellArr] = useState([]);
  const [forceData, setForceData] = useState(null);

  const { loggedIn } = useSelector((state) => state.authData);
  const currentDate = useSelector((state) => state.date.currentDate);
  const { borrowLoading, buyAcc, sellAcc, buyDayTotalAmt, sellDayTotalAmt } =
    useSelector((state) => state.borrowData);

  useEffect(() => {
    // console.log(moment(currentDate).format('YYYY-MM-DD'))
    if (loggedIn) {
      dispatch(
        getBorrowEntrysByDate({
          uId: loggedIn?._id,
          date: moment(currentDate).format("YYYY-MM-DD"),
        })
      );
    }
  }, [currentDate, loggedIn]);

  useEffect(() => {
    setConvertedBuytArr([]);
    setConvertedSellArr([]);
  }, [buyAcc, sellAcc]);

  const handelSelectForceData = (data) => {
    const isSameBAid = forceData?._id === data._id;

    if (isSameBAid) {
      setForceData(null);
      return;
    }

    const isValidData = data._id && data.entName;
    const isValidEtype = !data.entryId;

    if (isValidData && isValidEtype) {
      setForceData(data);
    }
  };
  const handelConvertToEng = (buyData, sellData) => {
    if (convertedBuyAccArr.length > 0 && convertedSellArr.length > 0) {
      setConvertedBuytArr([]);
      setConvertedSellArr([]);
    } else {
      const updatedBuyArr = updateArrConvertToEng(buyData);
      const updatedSellArr = updateArrConvertToEng(sellData);
      setConvertedBuytArr(updatedBuyArr);
      setConvertedSellArr(updatedSellArr);
    }
  };

  const handelEntryClick = (entryData) => {
    // console.log(entryData);
    if (entryData.type && entryData.entryId) {
      const navigateData = {
        S: "/master/customers",
        B: "/master/suppliers",
      };
      const navigateTo = `${navigateData[entryData.type]}/${entryData.entryId}`;
      // console.log(navigateTo);
      navigate(navigateTo);
    }
  };

  const handeDelete = async (data) => {
    if (data?._id) {
      const response = () => dispatch(deleteBorrowEntry(data));
      DeleteSweetAlert({
        title: "Are you sure you want to delete this entry?",
        icon1: "warning",
        title2: data.isSalesReturn
          ? `${data.entName} ${data.amount} માલ પરત`
          : `${data.entName} ${data.amount}`,
        text: "Entry deleted successfully",
        icon2: "success",
        callApi: response,
      });
    }
  };

  const handelImageClick = (data) => {
    // Set a timeout to call the single-click handler
    clickTimeout.current = setTimeout(() => {
      if (!isDoubleClick.current) {
        if (data?._id && data?.entName && data?.amount) {
          setOpenImgOptDailog([true, data]);
        }
      }
      isDoubleClick.current = false; // Reset double-click flag after processing
    }, 100); // Delay in milliseconds
  };

  const handelViewImageClick = (data) => {
    clearTimeout(clickTimeout.current); // Clear the single-click timeout
    isDoubleClick.current = true; // Set double-click flag
    if (data?._id && data?.entName && data?.amount) {
      setOpenViewImgDailog([true, data]);
    }
  };

  const handleShowTotal = () => {
    setShowTotalAmount(true);
    setTimeout(() => {
      // setShowAmount(false);
      setShowTotalAmount(false);
    }, 3000); // Hide the amount after 3 seconds
  };

  const handelUndo = async () => {
    dispatch(
      undoEntry({
        uId: loggedIn?._id,
        date: moment(currentDate).format("YYYY-MM-DD"),
      })
    );
  };

  const renderBuyData = (dataArray) => {
    return (
      <>
        <div className={BorrowStyle.creditBox}>
          {dataArray?.map((item, index) => {
            // Calculate time difference in seconds
            const timeDifferenceInSeconds =
              (Date.now() - new Date(item.createdAt).getTime()) / 1000;
            const isNewEntry = timeDifferenceInSeconds <= 30; // Within the last 20 seconds

            return (
              <div className={BorrowStyle.detialBox} key={index}>
                <h5
                  className={BorrowStyle.deletIcon}
                  onClick={() => handeDelete(item)}
                >
                  <Delete
                    sx={{
                      color: item.entName && item.amount ? "red" : "lightgray",
                    }}
                    fontSize="small"
                  />
                </h5>

                <h5 className={BorrowStyle.amtText}>
                  {!false ? item.amount : "XXXXX"}
                </h5>

                <BootstrapTooltip
                  placement="right"
                  arrow
                  title={
                    item.createdAt ? (
                      <div>
                        <Typography>({index + 1})</Typography>
                        <Typography>
                          {item.isSalesReturn
                            ? `${item.entName} માલ પરત`
                            : item.entName}{" "}
                          {item?.billNo ? `(${item?.billNo})` : ""}
                        </Typography>
                        <Typography>
                          {moment(item?.createdAt).format("hh:mm A")}
                        </Typography>
                      </div>
                    ) : null
                  }
                >
                  {!item.entryId && item.amount ? (
                    <h5
                      className={`${BorrowStyle.custText} ${
                        !isNewEntry && "flex"
                      }`}
                      onClick={() => handelSelectForceData(item)}
                      style={{
                        fontSize: isNewEntry && "1.1rem",
                        fontWeight: isNewEntry && "bolder",
                        backgroundColor: "yellow",
                      }}
                    >
                      {item.isSalesReturn
                        ? `${item.entName} માલ પરત`
                        : item.entName}{" "}
                      {item?.billNo ? `(${item?.billNo})` : ""}
                    </h5>
                  ) : (
                    <h5
                      className={`${BorrowStyle.custText} ${
                        !isNewEntry && "flex"
                      }`}
                      onDoubleClick={() => handelEntryClick(item)}
                      style={{
                        fontSize: isNewEntry && "1.1rem",
                        fontWeight: isNewEntry && "bolder",
                      }}
                    >
                      {item.isSalesReturn
                        ? `${item.entName} માલ પરત`
                        : item.entName}{" "}
                      {item?.billNo ? `(${item?.billNo})` : ""}
                    </h5>
                  )}
                </BootstrapTooltip>

                <h5
                  className={BorrowStyle.photoIcon}
                  onClick={() => handelImageClick(item)}
                  onDoubleClick={() => handelViewImageClick(item)}
                >
                  <AddAPhotoIcon
                    sx={{
                      color:
                        item.entName && item.amount ? "primary" : "lightgray",
                    }}
                    fontSize="small"
                  />
                </h5>
              </div>
            );
          })}
        </div>
        <div className={BorrowStyle.dTotalText} onClick={handleShowTotal}>
          {showTotalAmount ? `${buyDayTotalAmt.toLocaleString()}/-` : "XXXXX"}
        </div>
      </>
    );
  };

  const renderSellData = (dataArray) => {
    return (
      <>
        <div className={BorrowStyle.debitBox}>
          {dataArray?.map((item, index) => {
            // Calculate time difference in seconds
            const timeDifferenceInSeconds =
              (Date.now() - new Date(item.createdAt).getTime()) / 1000;
            const isNewEntry = timeDifferenceInSeconds <= 30; // Within the last 20 seconds
            return (
              <div
                className={BorrowStyle.detialBox}
                key={index}
                // style={{
                //   borderBottom:
                //     debitLastOccurrence[item.etype] === index
                //       ? `${
                //           colorMap[item.etype] || "1px solid #950000"
                //         }` // Set color for last occurrence
                //       : "1px solid #950000", // Reset color for non-last occurrences
                // }}
              >
                <h5
                  className={BorrowStyle.deletIcon}
                  onClick={() => handeDelete(item)}
                >
                  <Delete
                    sx={{
                      color: item.entName && item.amount ? "red" : "lightgray",
                    }}
                    fontSize="small"
                  />
                </h5>

                <h5 className={BorrowStyle.amtText}>
                  {!false ? item.amount : "XXXXX"}
                </h5>

                <BootstrapTooltip
                  placement="left"
                  arrow
                  title={
                    item.createdAt ? (
                      <div>
                        <Typography>({index + 1})</Typography>
                        <Typography>
                          {item.isSalesReturn
                            ? `${item.entName} માલ પરત`
                            : item.entName}{" "}
                          {item?.billNo ? `(${item?.billNo})` : ""}
                        </Typography>
                        <Typography>
                          {moment(item?.createdAt).format("hh:mm A")}
                        </Typography>
                      </div>
                    ) : null
                  }
                >
                  {!item.entryId && item.amount ? (
                    <h5
                      className={`${BorrowStyle.custText} ${
                        !isNewEntry && "flex"
                      }`}
                      onClick={() => handelSelectForceData(item)}
                      style={{
                        fontSize: isNewEntry && "1.1rem",
                        fontWeight: isNewEntry && "bolder",
                        backgroundColor: "yellow",
                      }}
                    >
                      {item.isSalesReturn
                        ? `${item.entName} માલ પરત`
                        : item.entName}{" "}
                      {item?.billNo ? `(${item?.billNo})` : ""}
                    </h5>
                  ) : (
                    <h5
                      className={`${BorrowStyle.custText} ${
                        !isNewEntry && "flex"
                      }`}
                      onDoubleClick={() => handelEntryClick(item)}
                      style={{
                        fontSize: isNewEntry && "1.1rem",
                        fontWeight: isNewEntry && "bolder",
                      }}
                    >
                      {item.isSalesReturn
                        ? `${item.entName} માલ પરત`
                        : item.entName}{" "}
                      {item?.billNo ? `(${item?.billNo})` : ""}
                    </h5>
                  )}
                </BootstrapTooltip>

                <h5
                  className={BorrowStyle.photoIcon}
                  onClick={() => handelImageClick(item)}
                  onDoubleClick={() => handelViewImageClick(item)}
                >
                  <AddAPhotoIcon
                    sx={{
                      color:
                        item.entName && item.amount ? "primary" : "lightgray",
                    }}
                    fontSize="small"
                  />
                </h5>
              </div>
            );
          })}
        </div>
        <div className={BorrowStyle.dTotalText} onClick={handleShowTotal}>
          {showTotalAmount ? `${sellDayTotalAmt.toLocaleString()}/-` : "XXXXX"}
        </div>
      </>
    );
  };

  return (
    <div className={BorrowStyle.main}>
      {/* <div className={BorrowStyle.otherBtnGrp}>
        <IconButton
          size="small"
          className="btnRed"
          onClick={() => handelConvertToEng(buyAcc, sellAcc)}
        >
          <TranslateIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" className="btnRed" onClick={handelUndo}>
          <SettingsBackupRestoreIcon fontSize="small" />
        </IconButton>
      </div> */}
      <div className={BorrowStyle.otherBtnGrp}>
        <ExportButton
          buyData={buyAcc}
          sellData={sellAcc}
          buyTotal={buyDayTotalAmt}
          sellTotal={sellDayTotalAmt}
          date={currentDate ? moment(currentDate).format("DD-MM-YY") : null}
          page={"ઉધાર ખરીદ-વેચાણ"}
        />
      </div>
      {borrowLoading ? (
        <div className={BorrowStyle.skeleton}>
          <div style={{ width: "50%", margin: "1rem 0rem" }}>
            <LoadingSkeleton
              row={18}
              columns={1}
              width={"100%"}
              height={25}
              margin={".2rem 0rem"}
            />
          </div>
          <div style={{ width: "50%", margin: "1rem 0rem" }}>
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
        <>
          <div className={BorrowStyle.subMain}>
            <div
              style={{ width: "50%", maxHeight: "100%", overflowY: "scroll" }}
            >
              {convertedBuyAccArr.length > 0
                ? renderBuyData(convertedBuyAccArr)
                : renderBuyData(buyAcc)}
            </div>
            <div className={BorrowStyle.verticalHr}></div>
            <div
              style={{ width: "50%", maxHeight: "100%", overflowY: "scroll" }}
            >
              {convertedSellArr.length > 0
                ? renderSellData(convertedSellArr)
                : renderSellData(sellAcc)}
            </div>
          </div>
        </>
      )}
      {forceData ? (
        <WrtieBorrowNotfoundEntry
          forceData={forceData}
          setForceData={setForceData}
        />
      ) : (
        <BorrowWriteEntry />
      )}
      <ImageOptionDailog
        openImgOptDailog={openImgOptDailog}
        setOpenImgOptDailog={setOpenImgOptDailog}
      />
      <ViewImageDailog
        openViewImgDailog={openViewImgDailog}
        setOpenViewImgDailog={setOpenViewImgDailog}
      />
    </div>
  );
}
