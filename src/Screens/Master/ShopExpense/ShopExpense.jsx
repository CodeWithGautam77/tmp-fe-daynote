import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import AngadiaImg from "../../../Image/angadia.png";
import ShopExpenseStyle from "./shopExpense.module.scss";
import { useCallback, useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useDispatch, useSelector } from "react-redux";
import { getEntityById, getEntitysByType } from "../../../apis/entitySlice";
import LoadingSkeleton from "../../../components/Skeleton/LoadingSkeleton";
import { debounce } from "lodash";
import LeftRedArrowIcon from "../../../Image/red/leftRedArrow.png";
import RightRedArrowIcon from "../../../Image/red/rightRedArrow.png";
import { useParams } from "react-router-dom";
import { getHistory } from "../../../apis/historySlice";
import moment from "moment";
import ShopExpenseDialog from "../../Dailogs/ShopExpenseDialog";

export default function ShopExpense() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [openShopExpenseDialog, setOpenShopExpenseDialog] = useState([
    false,
    null,
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);

  // const handleChange = (index) => (event, isExpanded) => {
  //   setExpanded((prev) => ({
  //     ...prev,
  //     [index]: isExpanded,
  //   }));
  // };
  const { loggedIn } = useSelector((state) => state.authData);
  const { entLoading, entitys } = useSelector((state) => state.entData);
  const { histories, hisLoading } = useSelector((state) => state.historyData);

  useEffect(() => {
    if (!id) {
      fetchData({ uId: loggedIn?._id, type: "SE", search, page });
    }
  }, [loggedIn, page]);

  const fetchData = async (params) => {
    try {
      const response = await dispatch(getEntitysByType(params));
      if (!response?.payload?.error) {
        if (response?.payload) {
          setTotalCount(response.payload.totalCount);
          setStartIndex(page * pageSize + 1);
          setEndIndex(page * pageSize + response.payload.data.length);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      // setPage(0); // Reset page to 1 on search
      // setSearch(searchTerm);
      fetchData({
        uId: loggedIn?._id,
        type: "SE",
        search: searchTerm,
        page: 0,
      });
    }, 1000), // Adjust the debounce time as needed
    [loggedIn]
  );

  // Handle input change
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearch(value);

    debouncedSearch(value);
  };

  const handleChange = (panel, id) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if (isExpanded) {
      dispatch(getHistory({ uId: loggedIn?._id, entityId: id }));
    }
  };

  const handleNext = () => {
    if ((page + 1) * pageSize < totalCount) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    if (id && loggedIn) {
      // console.log(id);
      dispatch(getEntityById({ uId: loggedIn?._id, id: id }));
      setExpanded(`panel${0}`);
      dispatch(getHistory({ uId: loggedIn?._id, entityId: id }));
    }
  }, [id, loggedIn]);

  return (
    <div className={ShopExpenseStyle.custBox}>
      <div className={"flexEnd"}>
        {/* <img src={AngadiaImg} alt="AngadiaImg" height={50} /> */}
        <div className="flex gap-1">
          {/* <OutlinedInput
            fullWidth
            id="search"
            name="search"
            type={"text"}
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
            // onBlur={formik.handleBlur}

            sx={{
              zIndex: 10,
              outline: "none",
              border: "none",
              width: "100%",
              height: "2.3rem",
              backgroundColor: "#FFF",
              borderRadius: "5rem",
              marginTop: ".5rem",
              "& .MuiInputBase-input": {
                border: "none",
              },
              "& fieldset": {
                border: "none", // Remove the default border
              },
            }}
            endAdornment={
              <InputAdornment position="end" sx={{ paddingRight: "1rem" }}>
                <IconButton aria-label="toggle password visibility" edge="end">
                  <img src={SearchIcon} alt="SearchIcon" height={20} />
                </IconButton>
              </InputAdornment>
            }
          /> */}
          <Button
            className="submitBtn"
            variant="contained"
            style={{ minWidth: "7rem", marginTop: ".5rem" }}
            size="small"
            onClick={() => setOpenShopExpenseDialog([true, null])}
          >
            Add New
          </Button>
        </div>
      </div>
      <div className={ShopExpenseStyle.dataBox}>
        {entLoading ? (
          <LoadingSkeleton
            row={10}
            columns={1}
            width={"100%"}
            height={50}
            margin={"1rem 0rem"}
          />
        ) : (
          <>
            {entitys.length > 0 &&
              entitys.map((item, index) => (
                <Accordion
                  key={index}
                  className="dataAccordion"
                  elevation={0}
                  expanded={expanded === `panel${index}`} // Expand only one panel at a time
                  onChange={handleChange(`panel${index}`, item?._id)} // Use dynamic panel ids
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index + 1}-content`}
                    id={`panel${index + 1}-header`}
                    className="dataAccordionSummary"
                    style={{
                      backgroundColor:
                        expanded === `panel${index}` ? "#af000021" : "#FFF",
                    }}
                  >
                    <Typography
                      sx={{
                        width: expanded === `panel${index}` ? "100%" : "100%",
                        textTransform: "capitalize",
                      }}
                      className="flex dataName"
                      fontSize={18}
                      fontWeight={700}
                    >
                      {item.name}
                    </Typography>
                    <div style={{ margin: "0rem 1rem" }} className="flexCenter">
                      <Typography fontWeight={600} fontSize={17}>
                        {Number(item?.amount).toFixed()}
                      </Typography>
                    </div>
                    <IconButton
                      className="accordionEditIconBtn"
                      size="medium"
                      onClick={() => setOpenShopExpenseDialog([true, item])}
                    >
                      <BorderColorIcon fontSize="small" />
                    </IconButton>
                  </AccordionSummary>
                  <AccordionDetails className="dataAccordionDetails">
                    <div className="flexBetween">
                      <Typography>Note:-{item.note}</Typography>
                    </div>
                    <hr style={{ margin: ".7rem 0rem" }} />
                    {hisLoading ? (
                      <LoadingSkeleton
                        row={5}
                        columns={1}
                        width={"100%"}
                        height={"1rem"}
                        margin={".3rem 0rem"}
                      />
                    ) : (
                      <div>
                        {histories && histories.length > 0 ? (
                          histories.map((item, index) => {
                            return (
                              <div
                                className={ShopExpenseStyle.hDetailBox}
                                key={index}
                              >
                                <Typography
                                  fontWeight={600}
                                  fontSize={17}
                                  className={ShopExpenseStyle.sr}
                                >
                                  {index + 1})
                                </Typography>
                                <Typography
                                  fontWeight={600}
                                  fontSize={17}
                                  className={ShopExpenseStyle.date}
                                >
                                  {moment(item?.date).format("DD-MM-YYYY")}
                                </Typography>
                                <Typography
                                  fontWeight={600}
                                  fontSize={17}
                                  className={ShopExpenseStyle.amount}
                                >
                                  {item.amount}
                                </Typography>
                                <Typography
                                  fontWeight={600}
                                  fontSize={17}
                                  className={ShopExpenseStyle.type}
                                >
                                  {item.accType === "D"
                                    ? "Debit"
                                    : item.accType === "C"
                                    ? "Credit"
                                    : ""}
                                </Typography>
                              </div>
                            );
                          })
                        ) : (
                          <Typography
                            fontWeight={600}
                            fontSize={17}
                            className="flexCenter"
                          >
                            No Histories Found
                          </Typography>
                        )}
                      </div>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
          </>
        )}
      </div>
      <div className="paginationControls flexCenter">
        {/* <button onClick={handlePrevious} disabled={page === 0} className="">
          Previous
        </button> */}
        <div className="paginationButton" onClick={handlePrevious}>
          <img src={LeftRedArrowIcon} alt="LeftRedArrowIcon" height={15} />
        </div>
        <Typography className="paginationInfo">
          {startIndex} - {endIndex} of {totalCount}
        </Typography>
        {/* <button
          onClick={handleNext}
          disabled={(page + 1) * 10 >= totalCount}
          className="paginationButton"
        >
          Next
        </button> */}
        <div className="paginationButton" onClick={handleNext}>
          <img src={RightRedArrowIcon} alt="LeftRedArrowIcon" height={15} />
        </div>
      </div>
      <ShopExpenseDialog
        openShopExpenseDialog={openShopExpenseDialog}
        setOpenShopExpenseDialog={setOpenShopExpenseDialog}
      />
    </div>
  );
}
