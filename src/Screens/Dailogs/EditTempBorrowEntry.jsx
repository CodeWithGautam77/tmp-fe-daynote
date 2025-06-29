import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useFormik } from "formik";
import {
  calculatePercentageAmount,
  DeleteSweetAlert,
  phoneConvertGujaratiToEnglish,
} from "../../common/common.js";
import DailogStyle from "./DailogStyle.module.scss";
import WriteDivField from "../../components/WriteDivField.js";
import { useState } from "react";
import {
  deleteTempBorrowEntry,
  updateTempBorrowEntry,
} from "../../apis/mainSlice.js";
import WriteTempLongtermLedger from "../Temp_Longterm_Ledger/WriteTempLongtermLedger.jsx";
import { fetchTempLongtermLedgers } from "../../apis/tempLongtermLedger.js";
import Histories from "../Master/Histories.jsx";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function EditTempBorrowEntry(props) {
  const { openEditTempBorrowDialog, setOpenEditTempBorrowDialog } = props;

  const dispatch = useDispatch();
  const { mainscreenLoading } = useSelector((state) => state.mainData);
  const { loggedIn } = useSelector((state) => state.authData);
  const { tempLongtermLedgers } = useSelector(
    (state) => state.tempLongtermLedgerData
  );
  // console.log("tempLongtermLedgers", tempLongtermLedgers);

  const [oldValues, setOldValues] = useState({
    entName: "",
    entArea: "",
    entPhone: "",
    amount: "",
  });
  const [expanded, setExpanded] = useState(false);

  const formik = useFormik({
    initialValues: {
      entName: "",
      entArea: "",
      entPhone: "",
      amount: "",
    },
    onSubmit: async (values, { resetForm }) => {
      const cutOffPercentage = loggedIn?.cutOff || null;

      const finalData = {
        entName: values.entName ? values.entName : oldValues.entName,
        entArea: values.entArea ? values.entArea : oldValues.entArea,
        entPhone: values.entPhone ? values.entPhone : oldValues.entPhone,
        amount: cutOffPercentage && values?.amount
          ? calculatePercentageAmount(values?.amount, cutOffPercentage)
          : oldValues?.amount,
        _id: oldValues._id,
      };
      // console.log(finalData);
      const response = await dispatch(updateTempBorrowEntry(finalData));
      if (!response.payload?.error) {
        handleClose();
        toast.success(response.payload?.message);
        resetForm();
      }
    },
  });

  useEffect(() => {
    if (openEditTempBorrowDialog[1]) {
      setOldValues(openEditTempBorrowDialog[1]);
      dispatch(
        fetchTempLongtermLedgers({
          uId: loggedIn?._id,
          type: "T",
          dataId: openEditTempBorrowDialog[1]?._id,
        })
      );
    }
  }, [openEditTempBorrowDialog]);

  const handleClose = () => {
    setOpenEditTempBorrowDialog([false, null, null]);
    formik.resetForm();
  };

  const handleCancel = () => {
    setOpenEditTempBorrowDialog([false, null, null]);
    formik.resetForm();
  };

  const handleTextInput = (event, name) => {
    const value = event.target.textContent;
    formik.setFieldValue(name, value);
  };

  const handleNumberInput = (event, name) => {
    const value = event.target.textContent;
    // const translatedValue = convertGujaratiToEnglish(value);
    const translatedValue =
      name === "amount"
        ? phoneConvertGujaratiToEnglish(value)
        : name === "entPhone"
        ? phoneConvertGujaratiToEnglish(value)
        : value;
    const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
    if (isNumeric) {
      formik.setFieldValue(name, translatedValue);
    }
  };

  const handleBlur = (fieldName) => {
    formik.handleBlur({
      target: { name: fieldName },
    });
  };

  const fields = [
    {
      name: "entName",
      placeholder: "નામ",
      handler: handleTextInput,
      type: "text",
    },
    {
      name: "entArea",
      placeholder: "સીટી",
      handler: handleTextInput,
      type: "text",
    },
    {
      name: "entPhone",
      placeholder: "ફોન નંબર",
      handler: handleNumberInput,
      type: "number",
    },
    // {
    //   name: "amount",
    //   placeholder: "રકમ",
    //   handler: handleNumberInput,
    //   type: "number",
    // },
  ];

  const handleDelete = async () => {
    if (oldValues?._id) {
      setOpenEditTempBorrowDialog([false, openEditTempBorrowDialog[1], null]);
      const response = () =>
        dispatch(deleteTempBorrowEntry({ id: oldValues._id }));
      DeleteSweetAlert({
        title: "Are you sure you want to delete this entry?",
        icon1: "warning",
        title2: `${oldValues.entName} ${oldValues.amount}`,
        text: "Entry deleted successfully",
        icon2: "success",
        callApi: response,
        setOldData: handleClose(),
      });
    }
  };

  const findOpeningBalance = tempLongtermLedgers.find((item) => item.isOpen);
  // console.log("findOpeningBalance", findOpeningBalance);
  return (
    <React.Fragment>
      <Dialog
        open={openEditTempBorrowDialog[0]}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle className="modalHeader">
          <div className="flex">
            <h3 className="w-100">Update/Delete Entry</h3>
            <IconButton
              onClick={handleCancel}
              aria-label="cancel"
              style={{
                backgroundColor: "#fff",
                color: "red",
                marginRight: ".3rem",
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent className="modalContent">
          <>
            {mainscreenLoading ? (
              <div className={`inputBox ${DailogStyle.wrtieDiv}`}>
                Loading...
              </div>
            ) : (
              <>
                <div className="flex gap-1 w-100">
                  <div style={{ width: "50%" }} className="inputBox">
                    <Typography
                      fontWeight={550}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {oldValues.entName}
                    </Typography>
                    <div
                      className={
                        formik.touched.entName && formik.errors.entName
                          ? DailogStyle.wrtieBoxError
                          : DailogStyle.wrtieBox
                      }
                      style={{ width: "100%" }}
                    >
                      <WriteDivField
                        style={{ width: "100%" }}
                        customClass={DailogStyle.wrtieDiv}
                        handleInput={(e) => handleTextInput(e, "entName")}
                        handleBlur={() => handleBlur("entName")}
                        placeholder="નામ"
                      />
                    </div>
                    {formik.touched.entName && formik.errors.entName && (
                      <div className={DailogStyle.errorText}>
                        {formik.errors.entName}
                      </div>
                    )}
                  </div>

                  <div style={{ width: "50%" }} className="inputBox">
                    <Typography
                      fontWeight={550}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {oldValues.entArea}
                    </Typography>
                    <div
                      className={
                        formik.touched.entArea && formik.errors.entArea
                          ? DailogStyle.wrtieBoxError
                          : DailogStyle.wrtieBox
                      }
                      style={{ width: "100%" }}
                    >
                      <WriteDivField
                        style={{ width: "100%" }}
                        customClass={DailogStyle.wrtieDiv}
                        handleInput={(e) => handleTextInput(e, "entArea")}
                        handleBlur={() => handleBlur("entArea")}
                        placeholder="સીટી"
                      />
                    </div>
                    {formik.touched.entArea && formik.errors.entArea && (
                      <div className={DailogStyle.errorText}>
                        {formik.errors.entArea}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="w-100 gap-1"
                  style={{ display: "flex", alignItems: "flex-end" }}
                >
                  <div style={{ width: "50%" }}>
                    <Typography
                      fontWeight={550}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {oldValues.entPhone}
                    </Typography>
                    <div
                      className={
                        formik.touched.entPhone && formik.errors.entPhone
                          ? DailogStyle.wrtieBoxError
                          : DailogStyle.wrtieBox
                      }
                      style={{ width: "100%" }}
                    >
                      <WriteDivField
                        style={{ width: "100%" }}
                        customClass={DailogStyle.wrtieDiv}
                        handleInput={(e) => handleNumberInput(e, "entPhone")}
                        handleBlur={() => handleBlur("entPhone")}
                        placeholder="ફોન નંબર"
                      />
                    </div>
                    {formik.touched.entPhone && formik.errors.entPhone && (
                      <div className={DailogStyle.errorText}>
                        {formik.errors.entPhone}
                      </div>
                    )}
                  </div>
                  <div style={{ width: "50%", height: "5rem" }}>
                    <Typography
                      className="w-100 flexCenter"
                      fontWeight={550}
                      sx={{
                        height: "100%",
                        textTransform: "capitalize",
                        border: "1px solid black",
                      }}
                      padding={1}
                    >
                      Balance :- &nbsp;
                      {oldValues?.amount?.toLocaleString()}
                    </Typography>
                  </div>
                </div>
                <DialogActions className="modalFooter flex gap-2">
                  <LoadingButton
                    loading={mainscreenLoading}
                    variant="contained"
                    type="button"
                    color="error"
                    onClick={handleDelete}
                    endIcon={<span />}
                  >
                    Delete
                  </LoadingButton>
                  <LoadingButton
                    loading={mainscreenLoading}
                    variant="contained"
                    type="button"
                    className="submitBtn"
                    onClick={formik.handleSubmit}
                    endIcon={<span />}
                  >
                    Edit
                  </LoadingButton>
                </DialogActions>
                <WriteTempLongtermLedger
                  data={oldValues}
                  setOldValues={setOldValues}
                />
              </>
            )}
          </>
        </DialogContent>
        <div className="w-100">
          <Accordion
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
            style={{ border: "1px solid black" }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600} fontSize={17}>
                લેઝર
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Histories
                histories={tempLongtermLedgers}
                page={"tempLongtermBorrow"}
                isDelete={true}
                data={oldValues}
                setOldValues={setOldValues}
              />
            </AccordionDetails>
          </Accordion>
        </div>
      </Dialog>
    </React.Fragment>
  );
}
