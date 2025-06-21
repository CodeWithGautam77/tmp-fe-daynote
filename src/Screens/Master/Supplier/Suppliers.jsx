import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import SuppliersImg from "../../../Image/supplier.png";
import SupStyle from "./supplier.module.scss";
import SearchIcon from "../../../Image/searchIcon.png";
import { useCallback, useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useDispatch, useSelector } from "react-redux";
import {
  getEntityById,
  getEntitysByType,
  getEntitysCityCount,
} from "../../../apis/entitySlice";
import LoadingSkeleton from "../../../components/Skeleton/LoadingSkeleton";
import { debounce } from "lodash";
import LeftRedArrowIcon from "../../../Image/red/leftRedArrow.png";
import RightRedArrowIcon from "../../../Image/red/rightRedArrow.png";
import SupplierDialog from "../../Dailogs/SupplierDialog";
import { useParams } from "react-router-dom";
import { getHistory, getHistoryWithMonthAgo } from "../../../apis/historySlice";
import moment from "moment";
import WriteDivField from "../../../components/WriteDivField";
import { ClearSharp } from "@mui/icons-material";
import PreviewIcon from "@mui/icons-material/Preview";
import ViewImageDailog from "../../Borrow/ViewImageDailog";
import BootstrapTooltip from "../../../components/Tooltip";
import Histories from "../Histories";

export default function Suppliers() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [openSupplierDialog, setOpenSupplierDialog] = useState([false, null]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [isAddNew, setIsAddNew] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [isSearchWrtiting, setIsSearchWrtiting] = useState(false);
  const [openViewImgDailog, setOpenViewImgDailog] = useState([false, null]);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [entityId, setEntityId] = useState(null);
  
  const { histories, grpHistories, hisLoading } = useSelector(
    (state) => state.historyData
  );

  const handleChange = (panel, id) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if (isExpanded) {
      setDateRange({ startDate: null, endDate: null });
      setEntityId(id);
      dispatch(getHistory({ uId: loggedIn?._id, entityId: id }));
    }
  };

  const { loggedIn } = useSelector((state) => state.authData);
  const { entLoading, entitys, citycount, citycountLoading } = useSelector(
    (state) => state.entData
  );

  useEffect(() => {
    if (!id && loggedIn) {
      fetchData({
        uId: loggedIn?._id,
        type: "S",
        search,
        page,
        city: selectedCity,
      });
      dispatch(getEntitysCityCount({ uId: loggedIn?._id, type: "S" }));
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
      // setTotalCount(response.totalCount); // Update total count from API response

      // // Calculate the new endIndex based on the current page and 10
      // const newStartIndex = page * 10 + 1;
      // setStartIndex(newStartIndex);
      // setEndIndex(Math.min(newStartIndex + 10, response.totalCount));
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
        type: "S",
        city: selectedCity,
        search: searchTerm,
        page: 0,
      });
    }, 1000), // Adjust the debounce time as needed
    [loggedIn, selectedCity]
  );

  // Handle input change
  const handleSearch = (event) => {
    const value = event.target.textContent;
    setSearch(value);
    debouncedSearch(value);
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
    if (selectedCity) {
      if (selectedCity === "All") {
        fetchData({
          uId: loggedIn?._id,
          type: "S",
          search,
          page,
          city: "",
        });
      } else {
        fetchData({
          uId: loggedIn?._id,
          type: "S",
          search,
          page,
          city: selectedCity,
        });
      }
    }
  }, [selectedCity]);

  useEffect(() => {
    if (id && loggedIn) {
      // console.log(id);
      dispatch(getEntityById({ uId: loggedIn?._id, id: id }));
      setExpanded(`panel${0}`);
      dispatch(getHistory({ uId: loggedIn?._id, entityId: id }));
    }
  }, [id, loggedIn]);

  useEffect(() => {
    if (entitys.length > 0) {
      dispatch(
        getHistoryWithMonthAgo({
          uId: loggedIn?._id,
          entityIds: entitys.map((item) => item._id),
        })
      );
    }
  }, [entitys]);

  const handleFilterHistory = () => {
      if (entityId) {
        const finalDates = {
          startDate: moment(dateRange.startDate).format("YYYY-MM-DD"),
          endDate: moment(dateRange.endDate).format("YYYY-MM-DD"),
        };
        dispatch(
          getHistory({
            uId: loggedIn?._id,
            entityId: entityId,
            ...finalDates,
          })
        );
      }
    };

  return (
    <div className={SupStyle.custBox}>
      <div className={"flexBetween"}>
        <img src={SuppliersImg} alt="SuppliersImg" height={50} />
        <h2 style={{ margin: "0rem 2rem" }}>
          {selectedCity ? selectedCity : "All"}
        </h2>
        <div
          className={`${!isSearchWrtiting ? "flexEnd gap-05" : ""}`}
          style={{ width: !isSearchWrtiting ? "100%" : "" }}
        >
          <FormControl
            size="small"
            style={{ width: !isSearchWrtiting ? "50%" : "100%" }}
          >
            <InputLabel id="demo-simple-select-label" size="small">
              Select City
            </InputLabel>
            <Select
              sx={{ background: "#fff", borderRadius: "none" }}
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCity || ""}
              label={"Select City"}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <MenuItem value={"All"}>All</MenuItem>
              {citycount?.map((item, index) => {
                return (
                  <MenuItem key={index} value={item.city}>
                    {item.city} - {item.count}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {!isSearchWrtiting && (
            <IconButton
              onClick={() => setIsSearchWrtiting(true)}
              sx={{ backgroundColor: "#fff", border: "1px solid gray" }}
            >
              <img src={SearchIcon} alt="SearchIcon" height={20} />
            </IconButton>
          )}
          {isSearchWrtiting && (
            <div
              className={
                isSearchWrtiting ? SupStyle.isCreditWriteBox : SupStyle.writeBox
              }
            >
              <IconButton
                size="small"
                className={SupStyle.closeBtn}
                onClick={() => {
                  setIsSearchWrtiting(false);
                }}
              >
                <ClearSharp
                  fontSize="small"
                  sx={{ color: "#fff", fontSize: "10px" }}
                />
              </IconButton>
              <WriteDivField
                customClass={SupStyle.writeInput}
                handleInput={(e) => {
                  handleSearch(e);
                }}
                placeholder={"Search..."}
              />
            </div>
          )}
        </div>
        {/* <div>
          <OutlinedInput
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
          />
        </div> */}
      </div>
      <div className={SupStyle.dataBox}>
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
              entitys.map((item, index) => {
                const findMonthsAgo = grpHistories.find(
                  (data) => data.entityId === item._id
                );
                return (
                  <Accordion
                    key={index}
                    className="dataAccordion"
                    elevation={0}
                    // onChange={handleChange(index, item._id)}
                    // defaultExpanded={expanded[index]}
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
                          findMonthsAgo &&
                          findMonthsAgo?.latestEntry?.monthsAgo > 1
                            ? "yellow"
                            : expanded === `panel${index}`
                            ? "#af000021"
                            : "#FFF",
                      }}
                    >
                      <Typography
                        sx={{
                          width: expanded === `panel${index}` ? "60%" : "100%",
                          textTransform: "capitalize",
                        }}
                        className="flex dataName"
                        fontSize={18}
                        fontWeight={700}
                      >
                        {item.name}
                      </Typography>
                      <div
                        style={{
                          // gap:"",
                          width: expanded === `panel${index}` ? "100%" : "0%",
                          marginTop: ".1rem",
                          marginLeft: "2rem",
                        }}
                        className="flexAround"
                      >
                        {expanded === `panel${index}` && (
                          <>
                            <Typography
                              fontWeight={600}
                              fontSize={17}
                              // sx={{ border: "1px solid red" }}
                            >
                              {item.city}
                            </Typography>
                            <Typography
                              fontWeight={600}
                              fontSize={17}
                              // sx={{ border: "1px solid red" }}
                            >
                              {item.phone}
                            </Typography>
                          </>
                        )}
                      </div>
                      <div
                        style={{ margin: "0rem 1rem" }}
                        className="flexCenter"
                      >
                        <BootstrapTooltip
                          arrow
                          placement="top"
                          title={
                            findMonthsAgo?.latestEntry?.monthsAgo > 1 && (
                              <div>
                                <Typography>
                                  {findMonthsAgo?.latestEntry?.monthsAgo > 1
                                    ? `${findMonthsAgo?.latestEntry?.monthsAgo} Months`
                                    : null}
                                </Typography>
                              </div>
                            )
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
                          <Typography fontWeight={600} fontSize={17}>
                            {Number(item?.amount).toLocaleString()}
                          </Typography>
                        </BootstrapTooltip>
                      </div>
                      <IconButton
                        className="accordionEditIconBtn"
                        size="medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenSupplierDialog([true, item])
                        }}
                      >
                        <BorderColorIcon fontSize="small" />
                      </IconButton>
                    </AccordionSummary>
                    <AccordionDetails className="dataAccordionDetails">
                      {expanded === `panel${index}` && (
                        <div className="flex">
                          <div style={{ width: "100%" }}>
                            <div className="flexBetween">
                              <Typography>
                                Search Name:-&nbsp;{item.searchName}
                              </Typography>
                              <Typography>
                                કસર:-&nbsp;
                                {item?.roundOffAmount?.toLocaleString()}
                              </Typography>
                              <Typography>
                                Reference:-{item.reference}
                              </Typography>
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
                                <Histories
                                  histories={[
                                    {
                                      accType: "C",
                                      amount: Number(item.openingBalance),
                                      baName: null,
                                      byWhom: null,
                                      date: item.createdAt,
                                      etype: "S",
                                      isOpen: true,
                                      type: "B",
                                    },
                                    ...histories,
                                  ]}
                                  page={"supplier"}
                                  data={item}
                                  setDateRange={setDateRange}
                                  dateRange={dateRange}
                                  handleSubmit={handleFilterHistory}
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <IconButton
                              size="small"
                              className="btnRed"
                              onClick={() => setOpenViewImgDailog([true, item])}
                            >
                              <PreviewIcon fontSize="small" />
                            </IconButton>
                          </div>
                        </div>
                      )}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
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
      {openSupplierDialog[0] && (
        <SupplierDialog
          openSupplierDialog={openSupplierDialog}
          setOpenSupplierDialog={setOpenSupplierDialog}
          setIsAddNew={setIsAddNew}
        />
      )}
      <ViewImageDailog
        openViewImgDailog={openViewImgDailog}
        setOpenViewImgDailog={setOpenViewImgDailog}
      />
    </div>
  );
}
