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
import * as yup from "yup";
import {
  calculatePercentageAmount,
  phoneConvertGujaratiToEnglish,
} from "../../common/common.js";
import DailogStyle from "./DailogStyle.module.scss";
import WriteDivField from "../../components/WriteDivField.js";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { updateLongtermBorrow } from "../../apis/longtermBorrowSlice.js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WriteTempLongtermLedger from "../Temp_Longterm_Ledger/WriteTempLongtermLedger.jsx";
import { fetchTempLongtermLedgers } from "../../apis/tempLongtermLedger.js";
import Histories from "../Master/Histories.jsx";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const validationSchema = yup.object({
  entPhone: yup
    .string()
    .min(10, "Phone number should be 10 digits")
    .max(10, "Phone number should be 10 digits")
    .notRequired(),
});

export default function EditLongtermBorrowEntry(props) {
  const { openEditLongtermBorrowDialog, setOpenEditLongtermBorrowDialog } =
    props;

  const dispatch = useDispatch();
  const { longtermBorrowLoading } = useSelector(
    (state) => state.longtermBorrowData
  );
  const { loggedIn } = useSelector((state) => state.authData);
  const { tempLongtermLedgers } = useSelector(
    (state) => state.tempLongtermLedgerData
  );

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
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const cutOffPercentage = loggedIn?.cutOff || null;

      const finalData = {
        ...values,
        amount: cutOffPercentage
          ? calculatePercentageAmount(values?.amount, cutOffPercentage)
          : values?.amount,
        _id: oldValues._id,
      };
      // console.log(finalData);
      const response = await dispatch(updateLongtermBorrow(finalData));
      if (!response.payload?.error) {
        handleClose();
        toast.success(response.payload?.message);
        resetForm();
      }
    },
  });

  useEffect(() => {
    if (openEditLongtermBorrowDialog[1]) {
      setOldValues(openEditLongtermBorrowDialog[1]);
      dispatch(
        fetchTempLongtermLedgers({
          uId: loggedIn?._id,
          type: "L",
          dataId: openEditLongtermBorrowDialog[1]?._id,
        })
      );
    }
  }, [openEditLongtermBorrowDialog]);

  const handleClose = () => {
    setOpenEditLongtermBorrowDialog([false, null, null]);
    formik.resetForm();
  };

  const handleCancel = () => {
    setOpenEditLongtermBorrowDialog([false, null, null]);
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
    {
      name: "amount",
      placeholder: "રકમ",
      handler: handleNumberInput,
      type: "number",
    },
  ];

  const findOpeningBalance = tempLongtermLedgers.find((item) => item.isOpen);

  return (
    <React.Fragment>
      <Dialog
        open={openEditLongtermBorrowDialog[0]}
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
            {longtermBorrowLoading ? (
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
                    loading={longtermBorrowLoading}
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
                {/* <div className="flexEnd gap-1 w-100">
                  <Typography
                    fontWeight={550}
                    sx={{
                      width: "50%",
                      height: "5rem",
                      textTransform: "capitalize",
                      border: "1px solid black",
                    }}
                    className="flexCenter"
                    padding={1}
                    mb={2.5}
                  >
                    Closing Balance :- {oldValues?.amount?.toLocaleString()}
                  </Typography>
                </div> */}
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
