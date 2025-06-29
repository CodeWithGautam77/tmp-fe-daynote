import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import LongtermBorrowWriteStyle from "./LongtermBorrowWriteEntry.module.scss";
import { toast } from "react-toastify";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import _ from "lodash";
import {
  calculatePercentageAmount,
  phoneConvertGujaratiToEnglish,
  removeEnglishWords,
} from "../../common/common";
import WriteDivField from "../../components/WriteDivField";
import { addLongtermBorrowEntry } from "../../apis/longtermBorrowSlice";
import moment from "moment";

export default function LongtermBorrowWriteEntry() {
  const dispatch = useDispatch();

  const { loggedIn } = useSelector((state) => state.authData);
  const { cities } = useSelector((state) => state.citiesData);
  const currentDate = useSelector((state) => state.date.currentDate);

  const [openAutoSubmit, setOpenAutoSubmit] = useState(false);

  const [isLongtermBorrowWriting, setIsLongtermBorrowWriting] = useState(false);

  const LongtermBorrowValidationSchema = yup.object({
    entName: yup.string().required("Please enter name"),
    // entArea: yup.string().required("Please enter area"),
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

  const formikLongtermBorrow = useFormik({
    initialValues: {
      entName: "",
      entArea: "",
      entPhone: "",
      amount: "",
    },
    validationSchema: LongtermBorrowValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsLongtermBorrowWriting(false);
      // console.log("formikLongtermBorrow Values-->", {
      //   ...values,
      //   uId: loggedIn._id,
      // });
      const cutOffPercentage = loggedIn?.cutOff || null;
      setOpenAutoSubmit(true);
      const response = await dispatch(
        addLongtermBorrowEntry({
          ...values,
          amount: cutOffPercentage
            ? calculatePercentageAmount(values?.amount, cutOffPercentage)
            : values?.amount,
          uId: loggedIn._id,
          date: moment(currentDate)?.format("YYYY-MM-DD"),
        })
      );
      if (!response.payload.error) {
        toast.success(response.payload.message);
        resetForm();
        setIsLongtermBorrowWriting(false);
        setOpenAutoSubmit(false);
      } else {
        setOpenAutoSubmit(false);
        resetForm();
        setIsLongtermBorrowWriting(false);
      }
    },
  });

  const handelNumberInput = (event, name) => {
    const value = event.target.textContent;
    if (value) {
      const translatedValue =
        name === "amount"
          ? phoneConvertGujaratiToEnglish(value)
          : name === "entPhone"
          ? phoneConvertGujaratiToEnglish(value)
          : value;
      const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
      if (isNumeric) {
        formikLongtermBorrow.setFieldValue(name, translatedValue);
      }
    } else {
      formikLongtermBorrow.setFieldValue(name, "");
    }
  };

  const handleTempBorrowInput = (event, name) => {
    // setIsLongtermBorrowWriting(true);
    const value = event.target.textContent;
    if (value) {
      // const updatedValue = removeEnglishWords(value);
      formikLongtermBorrow.setFieldValue(name, value);
    } else {
      formikLongtermBorrow.setFieldValue(name, "");
    }
  };

  useEffect(() => {
    if (formikLongtermBorrow.isValid && formikLongtermBorrow.dirty) {
      const outerTimeout = setTimeout(() => {
        // console.log('start', new Date());
        setOpenAutoSubmit(true);
        const innerTimeout = setTimeout(() => {
          formikLongtermBorrow.submitForm();
          setOpenAutoSubmit(false);
          // console.log('end', new Date());
        }, 2000); // 5 seconds

        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds

      return () => clearTimeout(outerTimeout);
    }
  }, [formikLongtermBorrow.values, formikLongtermBorrow.isValid]);

  const handelCancel = () => {
    setIsLongtermBorrowWriting(false);
    setOpenAutoSubmit(false);
    formikLongtermBorrow.resetForm();
  };

  return (
    <div>
      <div className={LongtermBorrowWriteStyle.mainBox}>
        {openAutoSubmit ? (
          <div className={LongtermBorrowWriteStyle.writeLogntermBox}>
            <label
              className={`${LongtermBorrowWriteStyle.inputLabel} gradient-text`}
            >
              ઉ. :
            </label>
            <div className={LongtermBorrowWriteStyle.autoSumitBox}>
              <CircularProgress size={50} />
              <h3 style={{ textAlign: "center" }}>Submitting Please Wait..</h3>
              <Button variant="contained" color="error" onClick={handelCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className={LongtermBorrowWriteStyle.writeLogntermBox}>
            <label
              className={`${LongtermBorrowWriteStyle.inputLabel} gradient-text`}
            >
              ઉ. :
            </label>
            <div className={LongtermBorrowWriteStyle.writeBox}>
              <div
                style={{
                  width: "100%",
                }}
                className={`flex ${
                  isLongtermBorrowWriting
                    ? LongtermBorrowWriteStyle.subWriteBox
                    : ""
                }`}
                onClick={() => setIsLongtermBorrowWriting(true)}
              >
                <div className={LongtermBorrowWriteStyle.nameBox}>
                  <div
                    className="flex"
                    style={{
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: "50%",
                        borderRight: "1px solid #00000040",
                      }}
                    >
                      <WriteDivField
                        customClass={LongtermBorrowWriteStyle.writeInput}
                        handleInput={(e) => handleTempBorrowInput(e, "entName")}
                        placeholder={"નામ"}
                        style={{
                          width: "100%",
                          height: "6rem",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        width: "50%",
                      }}
                    >
                      <WriteDivField
                        customClass={LongtermBorrowWriteStyle.writeInput}
                        style={{
                          height: "3.5rem",
                        }}
                        handleInput={(e) => handleTempBorrowInput(e, "entArea")}
                        placeholder={"સીટી"}
                      />
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label" size="small">
                          Select City
                        </InputLabel>
                        <Select
                          sx={{
                            background: "#fff",
                            borderRadius: "none",
                            // marginTop: ".2rem",
                          }}
                          size="small"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={formikLongtermBorrow.values.entArea || ""}
                          label={"Select City"}
                          onChange={(e) =>
                            formikLongtermBorrow.setFieldValue(
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
                    </div>
                  </div>
                  <WriteDivField
                    customClass={LongtermBorrowWriteStyle.writeInput}
                    handleInput={(e) => handelNumberInput(e, "entPhone")}
                    handleBlur={() =>
                      formikLongtermBorrow.handleBlur({
                        target: { name: "entPhone" },
                      })
                    }
                    placeholder={"ફોન નંબર"}
                    placeholderRight={
                      formikLongtermBorrow.values.entPhone?.length
                    }
                    style={{ borderBottomRightRadius: ".3rem", width: "100%" }}
                  />
                  {formikLongtermBorrow.touched.entPhone &&
                    formikLongtermBorrow.errors.entPhone && (
                      <div className={LongtermBorrowWriteStyle.error}>
                        {formikLongtermBorrow.errors.entPhone}
                      </div>
                    )}
                </div>

                <div className={LongtermBorrowWriteStyle.amtBox}>
                  <WriteDivField
                    customClass={LongtermBorrowWriteStyle.writeAmtInput}
                    handleInput={(e) => handelNumberInput(e, "amount")}
                    placeholder={"રકમ"}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              </div>
            </div>
            {/* <Button
                variant="contained"
                className={`submitBtn ${LongtermBorrowWriteStyle.submitButton}`}
                onClick={formikLongtermBorrow.handleSubmit}
              >
                Submit
              </Button> */}
          </div>
        )}
      </div>
    </div>
  );
}
