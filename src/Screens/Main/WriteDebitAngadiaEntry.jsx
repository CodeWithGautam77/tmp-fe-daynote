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
  getMatchingCreditEntitys,
  getMatchingDebitEntitys,
  setCreditEntitys,
  setDebitEntitys,
} from "../../apis/entitySlice";
import { addCashCreditBAEntry, addCreditBAEntry } from "../../apis/mainSlice";
import { ClearSharp } from "@mui/icons-material";
import moment from "moment";

export default function WriteDebitAngadiaEntry({
  selectedDebitA,
  setSelectedDebitA,
}) {
  const currentDate = useSelector((state) => state.date.currentDate);
  const dispatch = useDispatch();

  const { loggedIn } = useSelector((state) => state.authData);
  const { creditEntitys, entityAns, entLoading } = useSelector(
    (state) => state.entData
  );

  const [openAutoSubmit, setOpenAutoSubmit] = useState(false);
  const [isDebitAWriting, setIsDebitAWriting] = useState(false);
  const [byWhom, setByWhom] = useState("");
  const [isCashEntry, setIsCashEntry] = useState(false);

  useEffect(() => {
    if (selectedDebitA) {
      setIsDebitAWriting(true);
    }
  }, [selectedDebitA]);

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

  const formikDebitAEntry = useFormik({
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
      setIsDebitAWriting(false);
      const type = getEType(values.inputText);
      const cutOffPercentage = loggedIn?.cutOff || null;
      console.log("formikDebitAEntry Values-->", {
        ...values,
        baEntryId: selectedDebitA?._id,
        uId: loggedIn._id,
        etype: values.etype ? values.etype : type ? type : "C",
        date: moment(currentDate)?.format("YYYY-MM-DD"),
        baId: selectedDebitA?.entryId,
        bAName: selectedDebitA?.entName,
        amount: cutOffPercentage
          ? calculatePercentageAmount(values?.amount, cutOffPercentage)
          : values?.amount,
      });
      let response = null;
      if (isCashEntry) {
        response = await dispatch(
          addCashCreditBAEntry({
            ...values,
            entryId: null,
            baEntryId: selectedDebitA?._id,
            uId: loggedIn._id,
            etype: values.etype ? values.etype : type ? type : "C",
            date: moment(currentDate)?.format("YYYY-MM-DD"),
            baId: selectedDebitA?.entryId,
            bAName: selectedDebitA?.entName,
            amount: cutOffPercentage
              ? calculatePercentageAmount(values?.amount, cutOffPercentage)
              : values?.amount,
          })
        );
      } else {
        response = await dispatch(
          addCreditBAEntry({
            ...values,
            baEntryId: selectedDebitA?._id,
            uId: loggedIn._id,
            etype: values.etype ? values.etype : type ? type : "C",
            date: moment(currentDate)?.format("YYYY-MM-DD"),
            baId: selectedDebitA?.entryId,
            bAName: selectedDebitA?.entName,
            amount: cutOffPercentage
              ? calculatePercentageAmount(values?.amount, cutOffPercentage)
              : values?.amount,
          })
        );
      }
      if (!response.payload.error) {
        toast.success(response.payload.message);
        setSelectedDebitA(null);
        dispatch(setCreditEntitys([]));
        dispatch(setDebitEntitys([]));
        resetForm();
      } else {
        toast.error(response.payload.message);
        setSelectedDebitA(null);
        setOpenAutoSubmit(false);
        dispatch(setCreditEntitys([]));
        dispatch(setDebitEntitys([]));
        resetForm();
        setIsDebitAWriting(false);
      }
    },
  });

  useEffect(() => {
    if (isCashEntry) {
      setOpenAutoSubmit(true);
      formikDebitAEntry.validateForm().then(() => {});
    }
  }, [isCashEntry]);

  const handleCreditInput = (event) => {
    const value = event.target.textContent;
    const updatedValue = removeEnglishWords(value);
    formikDebitAEntry.setFieldValue("inputText", updatedValue);
    creditDebouncedSearch(value);
  };

  const handelAmtInput = (event) => {
    const value = event.target.textContent;
    if (value) {
      const translatedValue = phoneConvertGujaratiToEnglish(value);
      const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
      if (isNumeric) {
        formikDebitAEntry.setFieldValue("amount", translatedValue);
      }
    } else {
      formikDebitAEntry.setFieldValue("amount", "");
    }
  };

  const creditDebouncedSearch = useCallback(
    _.debounce(async (searchName) => {
      const searchText = removeSuffix(searchName);
      const stringWithoutSpaces = searchText?.replace(/\s+/g, "");
      const type = extractWord(stringWithoutSpaces);
      if (searchText) {
        const response = await dispatch(
          getMatchingCreditEntitys({
            uId: loggedIn?._id,
            type: type === null ? "C" : type,
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

  const handleByWhom = (event) => {
    const value = event.target.textContent;
    // const updatedValue = removeEnglishWords(value);
    formikDebitAEntry.setFieldValue("byWhom", value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setByWhom(formikDebitAEntry.values.byWhom);
    }, 500); // Adjust debounce time as needed

    return () => clearTimeout(handler); // Cleanup previous timeout
  }, [formikDebitAEntry.values.byWhom]);

  // const debitDebouncedSearch = useCallback(
  //   _.debounce(async (searchName) => {
  //     const searchText = removeSuffix(searchName);
  //     const stringWithoutSpaces = searchText?.replace(/\s+/g, "");
  //     const type = extractWord(stringWithoutSpaces);
  //     if (searchText) {
  //       const response = await dispatch(
  //         getMatchingDebitEntitys({
  //           uId: loggedIn?._id,
  //           type: type === null ? "S" : type,
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

  useEffect(() => {
    if (creditEntitys && creditEntitys.length > 0) {
      if (entityAns) {
        formikDebitAEntry.setValues({
          ...formikDebitAEntry.values,
          entryId: creditEntitys[creditEntitys.length - 1]._id,
          etype: creditEntitys[creditEntitys.length - 1].type,
        });
      }
    }
  }, [creditEntitys]);

  useEffect(() => {
    if (
      formikDebitAEntry.isValid &&
      formikDebitAEntry.dirty &&
      formikDebitAEntry.values.byWhom === byWhom
    ) {
      const outerTimeout = setTimeout(() => {
        // console.log('start', new Date());
        setOpenAutoSubmit(true);
        const innerTimeout = setTimeout(() => {
          formikDebitAEntry.submitForm();
          // console.log('end', new Date());
          setOpenAutoSubmit(false);
        }, 2000); // 5 seconds

        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds

      return () => clearTimeout(outerTimeout);
    }
  }, [formikDebitAEntry.values, formikDebitAEntry.isValid, byWhom]);

  const handelCancel = () => {
    setIsDebitAWriting(false);
    setOpenAutoSubmit(false);
    formikDebitAEntry.resetForm();
    setSelectedDebitA(null);
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
                isDebitAWriting
                  ? WriteCreditBAStyle.isCreditWriteBox
                  : WriteCreditBAStyle.writeBox
              }
            >
              {isDebitAWriting && (
                <div className="flex gap-05">
                  <IconButton
                    size="small"
                    className={WriteCreditBAStyle.closeBtn}
                    onClick={() => {
                      setIsDebitAWriting(false);
                      setSelectedDebitA(null);
                      dispatch(setCreditEntitys([]));
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
                    {selectedDebitA?.entName} - {selectedDebitA?.amount}
                  </Typography>
                </div>
              )}
              {isDebitAWriting && (
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
                      {formikDebitAEntry?.values?.inputText}
                    </div>
                  </div>
                  <div
                    style={{ width: "30%", borderLeft: "1px solid #00000040" }}
                  >
                    <div
                      style={{ backgroundColor: "#FFF", fontSize: "1.1rem" }}
                    >
                      {formikDebitAEntry?.values?.amount}
                    </div>
                  </div>
                </div>
              )}
              <div
                style={{
                  width: "100%",
                }}
                className={`flex ${
                  isDebitAWriting ? WriteCreditBAStyle.subWriteBox : ""
                }`}
                onClick={() => setIsDebitAWriting(true)}
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
              <div className="flex w-100" style={{ alignItems: "stretch" }}>
                <WriteDivField
                  style={{
                    backgroundColor: "white",
                    height: "3rem",
                    width: "100%",
                    marginTop: ".1rem",
                  }}
                  handleInput={handleByWhom}
                  placeholder={"હસ્તે"}
                />
                <Button
                  variant="contained"
                  className={`submitBtn ${WriteCreditBAStyle.cashBtn}`}
                  onClick={() => setIsCashEntry(true)}
                  disabled={
                    (!isValidNumber(formikDebitAEntry.values.amount) &&
                      Number(formikDebitAEntry.values.amount) === 0) ||
                    Number(formikDebitAEntry.values.amount) === 0
                  }
                  type="button"
                >
                  Cash
                </Button>
              </div>
            </div>

            {isDebitAWriting && (
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
                    {creditEntitys.length > 0 ? (
                      <>
                        {creditEntitys.map((item, index) => (
                          <option
                            key={index}
                            value={item._id}
                            className={
                              item._id === formikDebitAEntry.values.entryId
                                ? WriteCreditBAStyle.creditSelectedEntOption
                                : WriteCreditBAStyle.creditEntOption
                            }
                            onClick={() => {
                              formikDebitAEntry.setValues({
                                ...formikDebitAEntry.values,
                                entryId: item._id,
                                etype: item.type,
                              });
                            }}
                            ref={(el) => {
                              if (el && index === creditEntitys.length - 1) {
                                el.scrollIntoView({
                                  behavior: "smooth",
                                  block: "end",
                                });
                              }
                            }}
                          >
                            {item.searchName} - {item.type}
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
