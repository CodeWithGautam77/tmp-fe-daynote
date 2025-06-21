import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import WriteCreditBAStyle from "./WriteCreditBankAngadiaEntry.module.scss";
import { toast } from "react-toastify";
import {
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import _ from "lodash";
import {
  calculatePercentageAmount,
  extractWord,
  getEType,
  isValidNumber,
  phoneConvertGujaratiToEnglish,
  removeEnglishWords,
  removeSuffix,
} from "../../common/common";
import WriteDivField from "../../components/WriteDivField";
import {
  getMatchingDebitEntitys,
  setCreditEntitys,
  setDebitEntitys,
} from "../../apis/entitySlice";
import { addCashCreditBAEntry, addCreditBAEntry } from "../../apis/mainSlice";
import { ClearSharp } from "@mui/icons-material";
import moment from "moment";

export default function WriteCreditBankAngadiaEntry({
  selectedCreditBA,
  setSelectedCreditBA,
}) {
  const currentDate = useSelector((state) => state.date.currentDate);
  const dispatch = useDispatch();

  const { loggedIn } = useSelector((state) => state.authData);
  const { debitEntitys, entLoading, entityAns } = useSelector(
    (state) => state.entData
  );

  const [openAutoSubmit, setOpenAutoSubmit] = useState(false);
  const [isCreditBAWriting, setIsCreditBAWriting] = useState(false);
  const [isCashEntry, setIsCashEntry] = useState(false);
  const [byWhom, setByWhom] = useState("");

  useEffect(() => {
    if (selectedCreditBA) {
      setIsCreditBAWriting(true);
    }
  }, [selectedCreditBA]);

  const ValidationSchema = yup.object({
    entryId: yup.string().required("Please select"),
    amount: yup
      .string()
      .required("Please enter amount")
      .test(
        "not-zero",
        "Amount cannot be zero",
        (value) => value && !/^[0]+$/.test(value)
      ),
  });

  const cashValidationSchema = yup.object({
    amount: yup
      .string()
      .required("Please enter amount")
      .test(
        "not-zero",
        "Amount cannot be zero",
        (value) => value && !/^[0]+$/.test(value)
      ),
  });

  const formikCreditBAEntry = useFormik({
    initialValues: {
      entryId: "",
      amount: "",
      inputText: "",
      type: "D",
      etype: "",
      byWhom: "",
    },
    validationSchema: isCashEntry ? cashValidationSchema : ValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsCreditBAWriting(false);
      const type = getEType(values.inputText);
      const cutOffPercentage = loggedIn?.cutOff || null;

      console.log("formikCreditBAEntry Values-->", {
        ...values,
        baEntryId: selectedCreditBA?._id,
        uId: loggedIn._id,
        etype: values.etype ? values.etype : type ? type : "S",
        date: moment(currentDate)?.format("YYYY-MM-DD"),
        baId: selectedCreditBA?.entryId,
        bAName: selectedCreditBA?.entName,
        amount: cutOffPercentage
          ? calculatePercentageAmount(values?.amount, cutOffPercentage)
          : values?.amount,
      });
      let response = null;
      if (isCashEntry) {
        response = await dispatch(
          addCashCreditBAEntry({
            ...values,
            type: "C",
            entryId: null,
            baEntryId: selectedCreditBA?._id,
            uId: loggedIn._id,
            etype: values.etype ? values.etype : type ? type : "S",
            date: moment(currentDate)?.format("YYYY-MM-DD"),
            baId: selectedCreditBA?.entryId,
            bAName: selectedCreditBA?.entName,
            amount: cutOffPercentage
              ? calculatePercentageAmount(values?.amount, cutOffPercentage)
              : values?.amount,
          })
        );
      } else {
        response = await dispatch(
          addCreditBAEntry({
            ...values,
            baEntryId: selectedCreditBA?._id,
            uId: loggedIn._id,
            etype: values.etype ? values.etype : type ? type : "S",
            date: moment(currentDate)?.format("YYYY-MM-DD"),
            baId: selectedCreditBA?.entryId,
            bAName: selectedCreditBA?.entName,
            amount: cutOffPercentage
              ? calculatePercentageAmount(values?.amount, cutOffPercentage)
              : values?.amount,
          })
        );
      }

      if (!response.payload.error) {
        toast.success(response.payload.message);
        setSelectedCreditBA(null);
        dispatch(setCreditEntitys([]));
        dispatch(setDebitEntitys([]));
        resetForm();
      } else {
        toast.error(response.payload.message);
        setSelectedCreditBA(null);
        setOpenAutoSubmit(false);
        dispatch(setCreditEntitys([]));
        dispatch(setDebitEntitys([]));
        resetForm();
        setIsCreditBAWriting(false);
      }
    },
  });

  useEffect(() => {
    if (isCashEntry) {
      setOpenAutoSubmit(true);
      formikCreditBAEntry.validateForm().then(() => {});
    }
  }, [isCashEntry]);

  const handleByWhom = (event) => {
    const value = event.target.textContent;
    // const updatedValue = removeEnglishWords(value);
    formikCreditBAEntry.setFieldValue("byWhom", value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setByWhom(formikCreditBAEntry.values.byWhom);
    }, 500); // Adjust debounce time as needed

    return () => clearTimeout(handler); // Cleanup previous timeout
  }, [formikCreditBAEntry.values.byWhom]);

  const handleCreditInput = (event) => {
    const value = event.target.textContent;
    formikCreditBAEntry.setFieldValue("inputText", value);
    debitDebouncedSearch(value);
  };

  const handelAmtInput = (event) => {
    const value = event.target.textContent;
    if (value) {
      const translatedValue = phoneConvertGujaratiToEnglish(value);
      const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
      if (isNumeric) {
        formikCreditBAEntry.setFieldValue("amount", translatedValue);
      }
    } else {
      formikCreditBAEntry.setFieldValue("amount", "");
    }
  };

  // const creditDebouncedSearch = useCallback(
  //   _.debounce(async (searchName) => {
  //     const searchText = removeSuffix(searchName);
  //     const stringWithoutSpaces = searchText?.replace(/\s+/g, "");
  //     const type = extractWord(stringWithoutSpaces);
  //     if (searchText) {
  //       const response = await dispatch(
  //         getMatchingCreditEntitys({
  //           uId: loggedIn?._id,
  //           type: type === null ? "C" : type,
  //           entName: searchText,
  //         })
  //       );
  //       if (response.payload?.error) {
  //         toast.error(response.payload.message);
  //       }
  //     }
  //   }, 2000),
  //   [loggedIn]
  // );

  const debitDebouncedSearch = useCallback(
    _.debounce(async (searchName) => {
      const searchText = removeSuffix(searchName);
      const stringWithoutSpaces = searchText?.replace(/\s+/g, "");
      const type = extractWord(stringWithoutSpaces);
      if (searchText) {
        const response = await dispatch(
          getMatchingDebitEntitys({
            uId: loggedIn?._id,
            type: type === null ? "S" : type,
            entName: searchText,
          })
        );
        if (response.payload?.error) {
          toast.error(response.payload.message);
        }
      }
    }, 2000),
    [loggedIn]
  );

  useEffect(() => {
    if (debitEntitys && debitEntitys.length > 0) {
      if (entityAns) {
        formikCreditBAEntry.setFieldValue(
          "entryId",
          debitEntitys[debitEntitys.length - 1]._id
        );
      }
    }
  }, [debitEntitys]);

  useEffect(() => {
    if (
      formikCreditBAEntry.isValid &&
      formikCreditBAEntry.dirty &&
      formikCreditBAEntry.values.byWhom === byWhom
    ) {
      const outerTimeout = setTimeout(() => {
        // console.log('start', new Date());
        setOpenAutoSubmit(true);
        const innerTimeout = setTimeout(() => {
          formikCreditBAEntry.submitForm();
          // console.log('end', new Date());
          setOpenAutoSubmit(false);
        }, 2000); // 5 seconds

        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds

      return () => clearTimeout(outerTimeout);
    }
  }, [formikCreditBAEntry.values, formikCreditBAEntry.isValid, byWhom]);

  const handelCancel = () => {
    setIsCreditBAWriting(false);
    setOpenAutoSubmit(false);
    formikCreditBAEntry.resetForm();
    setSelectedCreditBA(null);
    setIsCashEntry(false);
  };

  return (
    <div className={WriteCreditBAStyle.mainNFWriteBox}>
      <div className={WriteCreditBAStyle.mainBox}>
        {/* --------------------------------------------- Credit Box ---------------------------------------- */}
        {openAutoSubmit ? (
          <div className={WriteCreditBAStyle.creditBox}>
            <div className={WriteCreditBAStyle.autoSumitBox}>
              <CircularProgress size={50} />
              <h3>Submitting Please Wait ..</h3>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={handelCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ width: "40%", position: "relative" }}>
            <div
              className={
                isCreditBAWriting
                  ? WriteCreditBAStyle.isCreditWriteBox
                  : WriteCreditBAStyle.writeBox
              }
            >
              {isCreditBAWriting && (
                <div className="flex gap-05">
                  <IconButton
                    size="small"
                    className={WriteCreditBAStyle.closeBtn}
                    onClick={() => {
                      setIsCreditBAWriting(false);
                      setSelectedCreditBA(null);
                      dispatch(setDebitEntitys([]));
                    }}
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
                    {selectedCreditBA?.entName} - {selectedCreditBA?.amount}
                  </Typography>
                </div>
              )}
              {isCreditBAWriting && (
                <div
                  className="w-100"
                  style={{
                    marginBottom: ".1rem",
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <div style={{ width: "70%" }}>
                    <div style={{ backgroundColor: "#FFF" }}>
                      {formikCreditBAEntry?.values?.inputText}
                    </div>
                  </div>
                  <div
                    style={{ width: "30%", borderLeft: "1px solid #00000040" }}
                  >
                    <div
                      style={{ backgroundColor: "#FFF", fontSize: "1.1rem" }}
                    >
                      {formikCreditBAEntry?.values?.amount}
                    </div>
                  </div>
                </div>
              )}
              <div
                style={{
                  width: "100%",
                }}
                className={`flex ${
                  isCreditBAWriting ? WriteCreditBAStyle.subWriteBox : ""
                }`}
                onClick={() => setIsCreditBAWriting(true)}
              >
                <div className={WriteCreditBAStyle.nameBox}>
                  <WriteDivField
                    customClass={WriteCreditBAStyle.writeInput}
                    handleInput={handleCreditInput}
                    placeholder={"નામ"}
                  />
                </div>
                <div className={WriteCreditBAStyle.amtBox}>
                  <WriteDivField
                    customClass={WriteCreditBAStyle.writeInput}
                    handleInput={handelAmtInput}
                    placeholder={"રકમ"}
                  />
                </div>
              </div>
              <div
                className="flex w-100"
                style={{ alignItems: "stretch", height: "3rem" }}
              >
                <WriteDivField
                  customClass={""}
                  style={{
                    backgroundColor: "white",
                    height: "96%",
                    width: "100%",
                    marginTop: "1px",
                  }}
                  handleInput={handleByWhom}
                  placeholder={"હસ્તે"}
                />
                <Button
                  variant="contained"
                  className={`submitBtn ${WriteCreditBAStyle.cashBtn}`}
                  onClick={() => setIsCashEntry(true)}
                  type="button"
                  disabled={
                    (!isValidNumber(formikCreditBAEntry.values.amount) &&
                      Number(formikCreditBAEntry.values.amount) === 0) ||
                    Number(formikCreditBAEntry.values.amount) === 0
                  }
                >
                  Cash
                </Button>
              </div>
            </div>

            {isCreditBAWriting && (
              <div className={WriteCreditBAStyle.creditSelectBox}>
                {entLoading ? (
                  <div
                    style={{ width: "100%", height: "12rem" }}
                    className="flexCenter"
                  >
                    <CircularProgress size={50} />
                  </div>
                ) : (
                  <>
                    {debitEntitys.length > 0 ? (
                      <>
                        {debitEntitys.map((item, index) => (
                          <option
                            key={index}
                            value={item._id}
                            className={
                              item._id === formikCreditBAEntry.values.entryId
                                ? WriteCreditBAStyle.creditSelectedEntOption
                                : WriteCreditBAStyle.creditEntOption
                            }
                            onClick={() => {
                              formikCreditBAEntry.setFieldValue(
                                "entryId",
                                item._id
                              );
                            }}
                            ref={(el) => {
                              if (el && index === debitEntitys.length - 1) {
                                el.scrollIntoView({
                                  behavior: "smooth",
                                  block: "end",
                                });
                              }
                            }}
                          >
                            {item.searchName}
                          </option>
                        ))}
                      </>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "12rem",
                          fontWeight: "700",
                        }}
                        className="flexCenter"
                      >
                        No Data Found
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
