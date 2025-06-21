import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useDispatch, useSelector } from "react-redux";
import { addToFav, getPhoneBook } from "../../apis/phoneBookSlice";
import LoadingSkeleton from "../../components/Skeleton/LoadingSkeleton";
import AddNamNumber from "./AddNamNumber";
import { Rating } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function PhoneBookDialog(props) {
  const { openPhoneBookDialog, setOpenPhoneBookDialog } = props;
  const dispatch = useDispatch();
  const { pbookLoading, phonebook } = useSelector((state) => state.pBookData);
  const { loggedIn } = useSelector((state) => state.authData);

  // State for the filter type (no filter by default)
  const [filterType, setFilterType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddnew, setIsAddnew] = useState(false);
  const [cityData, setCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (openPhoneBookDialog) {
      dispatch(
        getPhoneBook({
          uId: loggedIn?._id,
        })
      );
    }
  }, [openPhoneBookDialog]);

  useEffect(() => {
    if (phonebook && phonebook.length > 0) {
      const cityArray = Array.from(
        new Set(
          phonebook
            .map((item) => item.city || item.entArea) // Extract city or entArea
            .filter((value) => value !== undefined && value !== null) // Remove null/undefined
        )
      );
      // console.log('cityArray',cityArray)
      setCityData(cityArray);
    }
  }, [phonebook]);

  const handleClose = () => {
    setOpenPhoneBookDialog(false);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value); // Update the filter type
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value); // Update the filter type
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase()); // Update the search query
  };

  const typeNames = {
    C: "Customer",
    S: "Supplier",
    T: "ઉચક",
    L: "લામ્બા ગાડાના ઉચક",
  };

  // // Filter the phonebook based on the selected filter type, show all if filterType is empty
  // const filteredPhonebook = filterType
  //   ? phonebook?.filter((item) => item.type === filterType)
  //   : phonebook;

  const filteredPhonebook = phonebook?.filter((item) => {
    const name = item.name || item.entName || "";
    const phone = item.phone || item.entPhone || "";
    const city = item.city || item.entArea || "";

    const matchesType = filterType ? item.type === filterType : true;
    const matchesCity = selectedCity ? city === selectedCity : true;
    const matchesSearch =
      name.toLowerCase().includes(searchQuery) || phone.includes(searchQuery);

    return matchesType && matchesSearch && matchesCity;
  });

  const handelAddToFav = async (data) => {
    if (data && data?.type === "PB" && !data?.isFav) {
      dispatch(addToFav({ _id: data?._id }));
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={openPhoneBookDialog}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle className="modalHeader">
          <h3>Phone Book</h3>
        </DialogTitle>
        <DialogContent className="modalContent">
          <div>
            {pbookLoading ? (
              <div className="flexAround">
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
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems:"center",
                    marginBottom: "1rem",
                  }}
                >
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search by name or phone"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ padding: "0.5rem", width: "35%" }}
                  />

                  {/* Select filter */}
                  <select
                    value={filterType}
                    onChange={handleFilterChange}
                    style={{ padding: "0.5rem" }}
                  >
                    <option value="">All</option>
                    <option value="C">{typeNames["C"]}</option>
                    <option value="S">{typeNames["S"]}</option>
                    <option value="L">{typeNames["L"]}</option>
                    <option value="T">{typeNames["T"]}</option>
                  </select>
                  <select
                    value={selectedCity} 
                    onChange={handleCityChange}
                    style={{ padding: "0.5rem",width:"15%" }}
                  >
                    <option value="">All</option>
                    {cityData.map((item, index) => {
                      return <option key={index} value={item}>{item}</option>;
                    })}
                  </select>
                  <Button
                    className="submitBtn"
                    size="small"
                    sx={{ width: "18%" }}
                    variant="contained"
                    onClick={() => setIsAddnew((old) => !old)}
                  >
                    Add New
                  </Button>
                </div>
                {isAddnew && <AddNamNumber setIsAddnew={setIsAddnew} />}
                {phonebook && phonebook.length > 0 ? (
                  <>
                    {/* Display filtered phonebook */}
                    {filteredPhonebook.map((item, index) => {
                      return (
                        <div
                          className="flexAround"
                          key={index}
                          style={{
                            border: "1px solid #950000",
                          }}
                        >
                          <div
                            style={{
                              width: "10%",
                              fontSize: "20px",
                            }}
                          >
                            {index + 1}
                          </div>
                          <div
                            className="flex"
                            style={{
                              width: "40%",
                              borderLeft: "1px solid #950000",
                              textWrap: "nowrap",
                              overflowX: "scroll",
                              textTransform: "capitalize",
                              paddingLeft: ".2rem",
                              fontSize: "20px",
                              height: "28px",
                            }}
                          >
                            {item.name
                              ? item.name
                              : item.entName
                              ? item.entName
                              : ""}
                          </div>
                          <div
                            className="flex"
                            style={{
                              width: "24%",
                              borderLeft: "1px solid #950000",
                              borderRight: "1px solid #950000",
                              paddingLeft: ".2rem",
                              fontSize: "17px",
                              textWrap: "nowrap",
                              overflowX: "scroll",
                              height: "28px",
                            }}
                          >
                            {item.phone
                              ? item.phone
                              : item.entPhone
                              ? item.entPhone
                              : "Not Available"}
                          </div>
                          <div
                            className="flex"
                            style={{
                              width: "24%",
                              borderLeft: "1px solid #950000",
                              borderRight: "1px solid #950000",
                              paddingLeft: ".2rem",
                              fontSize: "17px",
                              textWrap: "nowrap",
                              overflowX: "scroll",
                              height: "28px",
                            }}
                          >
                            {item.city
                              ? item.city
                              : item.entArea
                              ? item.entArea
                              : "Not Available"}
                          </div>
                          <div
                            style={{
                              width: "21%",
                              // fontSize: "16px",
                              paddingLeft: ".2rem",
                              textWrap: "nowrap",
                              overflowY: "scroll",
                              height: "28px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {typeNames[item.type] ? (
                              typeNames[item.type]
                            ) : (
                              <Rating
                                // name="simple-controlled"
                                value={item?.isFav}
                                onChange={(event, newValue) => {
                                  // setValue(newValue);
                                  handelAddToFav(item);
                                }}
                                max={1}
                                size="medium"
                                // sx={{ fontSize: ".5rem" }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div>No data</div>
                )}
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions className="modalFooter">
          <Button
            variant="contained"
            onClick={handleClose}
            className="cancelBtn"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
