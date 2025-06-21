import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import debitBAwriteStyle from "./WriteDebitBankAngadiaEntry.module.scss";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  calculatePercentageAmount,
  isValidNumber,
  phoneConvertGujaratiToEnglish,
} from "../../common/common";
import WriteDivField from "../../components/WriteDivField";
import { ClearSharp } from "@mui/icons-material";
import { addBankAngadiaAccEntry } from "../../apis/mainSlice";
import { toast } from "react-toastify";
import moment from "moment";

export default function WriteDebitBankAngadiaEntry({
  selectedBAid,
  setSelectedBAid,
  setForceData,
}) {
  const currentDate = useSelector((state) => state.date.currentDate);

  const dispatch = useDispatch();

  const { loggedIn } = useSelector((state) => state.authData);
  const { cities } = useSelector((state) => state.citiesData);

  const [openAutoSubmit, setOpenAutoSubmit] = useState(false);
  const [isBAentryWriting, setIsBAentryWriting] = useState(false);
  const [isCashEntry, setIsCashEntry] = useState(false);

  useEffect(() => {
    if (selectedBAid) {
      setIsBAentryWriting(true);
    }
  }, [selectedBAid]);

  const BAentryValidationSchema = yup.object({
    // entName: yup.string().required("Please enter name"),
    // entArea: yup.string().required(),
    // entPhone: yup
    //   .string("Enter phone number")
    //   .min(10, "Phone number should be 10 digits")
    //   .max(10, "Phone number should be 10 digits")
    //   .required("Phone is required"),
    amount: yup
      .string()
      .required("Please enter amount")
      .test(
        "not-zero",
        "Amount cannot be zero",
        (value) => value && !/^[0]+$/.test(value)
      ),
  });

  const formikBAentry = useFormik({
    initialValues: {
      entName: "",
      entArea: "",
      entPhone: "",
      amount: "",
    },
    validationSchema: BAentryValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsBAentryWriting(false);
      setOpenAutoSubmit(true);
      // console.log({
      //   ...values,
      //   baId: selectedBAid?._id,
      //   uId: loggedIn._id,
      //   date: moment(currentDate)?.format("YYYY-MM-DD"),
      // });
      const cutOffPercentage = loggedIn?.cutOff || null;
      const response = await dispatch(
        addBankAngadiaAccEntry({
          ...values,
          baId: selectedBAid?._id,
          uId: loggedIn._id,
          amount: cutOffPercentage
            ? calculatePercentageAmount(values.amount, cutOffPercentage)
            : values.amount,
          date: moment(currentDate)?.format("YYYY-MM-DD"),
          baEntityId: selectedBAid?.entryId,
        })
      );

      if (!response.payload.error) {
        toast.success(response.payload.message);
        setIsBAentryWriting(false);
        resetForm();
        setOpenAutoSubmit(false);
        setIsCashEntry(false);
        // setSelectedBAid((old) => ({
        //   ...old,
        //   amount: response?.payload?.data?.updateBAEntry?.amount,
        // }));
        setSelectedBAid(null); //for Close bank Enetry Model
      } else {
        setOpenAutoSubmit(false);
        resetForm();
        setIsBAentryWriting(false);
        setIsCashEntry(false);
      }
    },
  });

  const handelAmtInput = (event, formik) => {
    const value = event.target.textContent;
    if (value) {
      const translatedValue = phoneConvertGujaratiToEnglish(value);
      const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
      if (isNumeric) {
        formik.setFieldValue("amount", translatedValue);
      }
    } else {
      formik.setFieldValue("amount", "");
    }
  };

  const handelPhoneInput = (event) => {
    const value = event.target.textContent;
    if (value) {
      const translatedValue = phoneConvertGujaratiToEnglish(value);
      const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
      if (isNumeric) {
        formikBAentry.setFieldValue("entPhone", translatedValue);
      }
    } else {
      formikBAentry.setFieldValue("entPhone", "");
    }
  };

  const handleBAentryInput = (event, name) => {
    const value = event.target.textContent;
    if (value) {
      formikBAentry.setFieldValue(name, value);
    } else {
      formikBAentry.setFieldValue(name, "");
    }
  };

  useEffect(() => {
    if (isCashEntry) {
      formikBAentry.setFieldValue("entName", "Cash");
      formikBAentry.handleSubmit();
    } else {
      formikBAentry.setFieldValue("entName", "");
    }
  }, [isCashEntry]);

  // useEffect(() => {
  //   if (formikBAentry.isValid && formikBAentry.dirty) {
  //     const outerTimeout = setTimeout(() => {
  //       // console.log('start', new Date());
  //       setOpenAutoSubmit(true);
  //       const innerTimeout = setTimeout(() => {
  //         formikBAentry.submitForm();
  //         setOpenAutoSubmit(false);
  //         // console.log('end', new Date());
  //       }, 2000); // 5 seconds

  //       return () => clearTimeout(innerTimeout);
  //     }, 3000); // 5 seconds

  //     return () => clearTimeout(outerTimeout);
  //   }
  // }, [formikBAentry.values, formikBAentry.isValid]);

  const handelCancel = (data, setIsWritingState, formik) => {
    setSelectedBAid(null);
    setForceData(null);
    setIsWritingState(false);
    setOpenAutoSubmit(data);
    setIsCashEntry(false);
    formik.resetForm();
  };

  return (
    <div className={debitBAwriteStyle.mainWriteBox}>
      <div className={debitBAwriteStyle.mainBox}>
        {openAutoSubmit ? (
          <div className={debitBAwriteStyle.autoSumitBox}>
            <CircularProgress size={40} />
            <h4 style={{ textAlign: "center" }}>Submitting Please Wait..</h4>
            <Button
              variant="contained"
              color="error"
              onClick={() =>
                handelCancel(false, setIsBAentryWriting, formikBAentry)
              }
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className={debitBAwriteStyle.baWriteEntryBox}>
            <div
              className={
                isBAentryWriting
                  ? debitBAwriteStyle.isTempBorrowWriteBox
                  : debitBAwriteStyle.writeBox
              }
            >
              <div className="flex gap-05">
                <IconButton
                  size="small"
                  className={debitBAwriteStyle.closeBtn}
                  onClick={() =>
                    handelCancel(false, setIsBAentryWriting, formikBAentry)
                  }
                >
                  <ClearSharp
                    fontSize="small"
                    sx={{ color: "#fff", fontSize: "10px" }}
                  />
                </IconButton>
                <Typography
                  fontSize={13}
                  fontWeight={600}
                  className="gradient-text"
                >
                  {selectedBAid?.entName} - {selectedBAid?.amount}
                </Typography>
              </div>
              <div
                style={{
                  width: "100%",
                }}
                className={`flex ${
                  isBAentryWriting ? debitBAwriteStyle.subWriteBox : ""
                }`}
                onClick={() => setIsBAentryWriting(true)}
              >
                <div className={debitBAwriteStyle.nameBox}>
                  <div
                    className="flex"
                    style={{
                      width: "100%",
                    }}
                  >
                    <div style={{ width: "50%" }}>
                      <WriteDivField
                        customClass={debitBAwriteStyle.writeNameInput}
                        handleInput={(e) => handleBAentryInput(e, "entName")}
                        placeholder={"નામ"}
                        style={
                          isBAentryWriting
                            ? {
                                height: "4.7rem",
                                width: "100%",
                              }
                            : { width: "100%" }
                        }
                      />
                    </div>
                    <div
                      style={{
                        width: "50%",
                      }}
                    >
                      <WriteDivField
                        customClass={debitBAwriteStyle.writeAreaInput}
                        handleInput={(e) => handleBAentryInput(e, "entArea")}
                        placeholder={"સીટી"}
                        style={
                          isBAentryWriting
                            ? {
                                height: "2.15rem",
                                borderBottom: "none",
                              }
                            : null
                        }
                      />
                      {isBAentryWriting && (
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{
                            backgroundColor: "#fff",
                          }}
                        >
                          <InputLabel
                            id="demo-simple-select-label"
                            size="small"
                          >
                            Select City
                          </InputLabel>
                          <Select
                            sx={{
                              // background: "#fff",
                              borderRadius: 0,
                            }}
                            size="small"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formikBAentry.values.entArea || ""}
                            label={"Select City"}
                            onChange={(e) =>
                              formikBAentry.setFieldValue(
                                "entArea",
                                e.target.value
                              )
                            }
                          >
                            {cities?.map((item, index) => {
                              return (
                                <MenuItem key={index} value={item}>
                                  {item}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      )}
                    </div>
                  </div>
                  <WriteDivField
                    customClass={debitBAwriteStyle.writePhoneInput}
                    handleInput={(e) => handelPhoneInput(e)}
                    placeholder={"ફોન નંબર"}
                    placeholderRight={formikBAentry.values.entPhone?.length}
                  />
                </div>
                <div className={debitBAwriteStyle.amtBox}>
                  <WriteDivField
                    customClass={debitBAwriteStyle.writeAmtInput}
                    handleInput={(e) => {
                      handelAmtInput(e, formikBAentry);
                    }}
                    placeholder={isBAentryWriting ? "રકમ" : ""}
                    style={
                      isBAentryWriting
                        ? {
                            height: "8.1rem",
                          }
                        : null
                    }
                  />
                </div>
              </div>
              <div className="flex w-100 gap-05">
                <Button
                  variant="contained"
                  className={`submitBtn ${debitBAwriteStyle.submitButton}`}
                  onClick={formikBAentry.handleSubmit}
                  disabled={
                    (!isValidNumber(formikBAentry.values.amount) &&
                      Number(formikBAentry.values.amount) === 0) ||
                    Number(formikBAentry.values.amount) === 0
                  }
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  className={`submitBtn ${debitBAwriteStyle.cashBtn}`}
                  onClick={() => setIsCashEntry(true)}
                  type="button"
                  disabled={
                    (!isValidNumber(formikBAentry.values.amount) &&
                      Number(formikBAentry.values.amount) === 0) ||
                    Number(formikBAentry.values.amount) === 0
                  }
                >
                  Cash
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
