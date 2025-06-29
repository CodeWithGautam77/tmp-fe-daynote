import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import Style from "./WriteCustSupEntry.module.scss";
import { toast } from "react-toastify";
import { Button, CircularProgress, IconButton } from "@mui/material";
import _ from "lodash";
import {
  extractWord,
  getEType,
  phoneConvertGujaratiToEnglish,
  removeEnglishWords,
  removeSuffix,
} from "../../common/common";
import moment from "moment";
import WriteDivField from "../../components/WriteDivField";
import {
  getMatchingCreditEntitys,
  getMatchingDebitEntitys,
  setCreditEntitys,
  setDebitEntitys,
} from "../../apis/entitySlice";
import { ClearSharp } from "@mui/icons-material";
import {
  addCustomerSupplierEntry,
  addForceCustomerSupplierEntry,
} from "../../apis/retailSlice";

export default function WriteCustSupEntry(props) {
  const {
    openAutoSubmit,
    setOpenAutoSubmit,
    secondCancelFunc,
    setFirstCancelFunc,
  } = props;

  const currentDate = useSelector((state) => state.date.currentDate);

  const dispatch = useDispatch();

  const { loggedIn } = useSelector((state) => state.authData);
  const { creditEntitys, debitEntitys, entityAns, entLoading } = useSelector(
    (state) => state.entData
  );

  const [memberId, setMemberId] = useState({
    C: "",
    D: "",
  });

  // const [openAutoSubmit, setOpenAutoSubmit] = useState([false, false]);
  const [isAddNew, setIsAddNew] = useState(false);

  const [forceAdd, setForceAdd] = useState({
    C: false,
    D: false,
  });

  const [isCreditWriting, setIsCreditWriting] = useState(false);
  const [isDebitWriting, setIsDebitWriting] = useState(false);
  const [creditByWhom, setCreditByWhom] = useState("");
  const [debitByWhom, setDebitByWhom] = useState("");
  const [removeCancelBtn, setRemoveCancelBtn] = useState(false);

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
    type: yup.string().required("Please select"),
    byWhom: yup.string(),
  });

  const forceValidationSchema = yup.object({
    inputText: yup.string().required("Please enter name"),
    amount: yup
      .string()
      .required("Please enter amount")
      .test(
        "not-zero",
        "Amount cannot be zero",
        (value) => value && !/^[0]+$/.test(value)
      ),
  });

  const formikCredit = useFormik({
    initialValues: {
      date: "",
      entryId: "",
      amount: "",
      iType: "I",
      entName: "",
      inputText: "",
      etype: "",
      type: "",
      byWhom: "",
    },
    validationSchema: forceAdd.C ? forceValidationSchema : ValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setOpenAutoSubmit([false, false]);
      setIsCreditWriting(false);
      setRemoveCancelBtn(true);
      const type = getEType(values.inputText);
      let finalData = {
        ...values,
        etype: values.etype ? values.etype : type ? type : "C",
        uId: loggedIn._id,
        date: moment(currentDate)?.format("YYYY-MM-DD"),
      };
      // console.log("finalData", finalData);
      let response = null;
      if (forceAdd.C) {
        response = await dispatch(addForceCustomerSupplierEntry(finalData));
      } else {
        response = await dispatch(addCustomerSupplierEntry(finalData));
      }

      if (!response.payload.error) {
        toast.success(response.payload.message);
        setForceAdd({
          C: false,
          D: false,
        });
        dispatch(setCreditEntitys([]));
        resetForm();
        setIsAddNew(false);
        setMemberId({
          C: "",
          D: "",
        });
        setRemoveCancelBtn(false);
      } else {
        toast.error(response.payload.message);
        setForceAdd({
          C: false,
          D: false,
        });
        dispatch(setCreditEntitys([]));
        resetForm();
        setIsAddNew(false);
        setIsCreditWriting(false);
        setMemberId({
          C: "",
          D: "",
        });
        setRemoveCancelBtn(false);
      }
    },
  });

  const formikDebit = useFormik({
    initialValues: {
      date: "",
      entryId: "",
      amount: "",
      iType: "E",
      entName: "",
      inputText: "",
      etype: "",
      type: "",
      byWhom: "",
    },
    validationSchema: forceAdd.D ? forceValidationSchema : ValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setOpenAutoSubmit([false, false]);
      setIsDebitWriting(false);
      setRemoveCancelBtn(true);
      const type = getEType(values.inputText);
      let finalData = {
        ...values,
        etype: values.etype ? values.etype : type ? type : "S",
        uId: loggedIn._id,
        date: moment(currentDate)?.format("YYYY-MM-DD"),
      };
      // console.log("formikDebit finalData-->", finalData);
      let response = null;
      if (forceAdd.D) {
        response = await dispatch(addForceCustomerSupplierEntry(finalData));
      } else {
        response = await dispatch(addCustomerSupplierEntry(finalData));
      }

      if (!response.payload.error) {
        toast.success(response.payload.message);
        setForceAdd({
          C: false,
          D: false,
        });
        dispatch(setDebitEntitys([]));
        resetForm();
        setIsAddNew(false);
        setIsDebitWriting(false);
        setMemberId({
          C: "",
          D: "",
        });
        setRemoveCancelBtn(false);
      } else {
        toast.error(response.payload.message);
        setForceAdd({
          C: false,
          D: false,
        });
        dispatch(setDebitEntitys([]));
        resetForm();
        setIsAddNew(false);
        setIsDebitWriting(false);
        setMemberId({
          C: "",
          D: "",
        });
        setRemoveCancelBtn(false);
      }
    },
  });

  const handelAmtInput = (event, formik, type) => {
    const value = event.target.textContent;
    if (value) {
      const translatedValue = phoneConvertGujaratiToEnglish(value);
      const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
      if (isNumeric) {
        formik.setValues({
          ...formik.values,
          amount: translatedValue,
          type: type,
        });
      }
    } else {
      formik.setValues({
        ...formik.values,
        amount: "",
        type: "",
      });
    }
  };

  useEffect(() => {
    if (formikCredit.values.inputText && !formikCredit.values.etype) {
      const type = getEType(formikCredit.values.inputText);
      formikCredit.setFieldValue("etype", type);
    }
    if (!formikCredit.values.inputText) {
      formikCredit.setFieldValue("etype", "");
    }
  }, [formikCredit.values]);

  useEffect(() => {
    if (formikDebit.values.inputText && !formikDebit.values.etype) {
      const type = getEType(formikDebit.values.inputText);
      formikDebit.setFieldValue("etype", type);
    }
    if (!formikDebit.values.inputText) {
      formikDebit.setFieldValue("etype", "");
    }
  }, [formikDebit.values]);

  const handleCreditByWhom = (event) => {
    const value = event.target.textContent;
    // const updatedValue = removeEnglishWords(value);
    formikCredit.setFieldValue("byWhom", value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setCreditByWhom(formikCredit.values.byWhom);
    }, 500); // Adjust debounce time as needed

    return () => clearTimeout(handler); // Cleanup previous timeout
  }, [formikCredit.values.byWhom]);

  const handleCreditInput = (event) => {
    const value = event.target.textContent;
    // const updatedValue = removeEnglishWords(value);
    formikCredit.setFieldValue("inputText", value);

    if (!isAddNew) {
      creditDebouncedSearch(value);
    }
  };

  const handleDebitByWhom = (event) => {
    const value = event.target.textContent;
    // const updatedValue = removeEnglishWords(value);
    formikDebit.setFieldValue("byWhom", value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebitByWhom(formikDebit.values.byWhom);
    }, 500); // Adjust debounce time as needed

    return () => clearTimeout(handler); // Cleanup previous timeout
  }, [formikDebit.values.byWhom]);

  const handleDebitInput = (event) => {
    const value = event.target.textContent;
    // const updatedValue = removeEnglishWords(value);
    formikDebit.setFieldValue("inputText", value);

    if (!isAddNew) {
      debitDebouncedSearch(value);
    }
  };

  const creditDebouncedSearch = useCallback(
    _.debounce(async (searchName) => {
      const searchText = removeSuffix(searchName);
      const stringWithoutSpaces = searchText?.replace(/\s+/g, "");
      const type = extractWord(stringWithoutSpaces);
      if (searchText && !isAddNew) {
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

  const debitDebouncedSearch = useCallback(
    _.debounce(async (searchName) => {
      // console.log("searchName -->", searchName);
      const searchText = removeSuffix(searchName);
      // console.log("searchText -->", searchText);
      const stringWithoutSpaces = searchText?.replace(/\s+/g, "");
      const type = extractWord(stringWithoutSpaces);
      if (type === "MR" && formikCredit.values.amount) {
        const holidays = formikCredit.values.amount * 10;
        formikDebit.setFieldValue("amount", holidays);
      }
      // console.log("type -->", type);
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
    if (creditEntitys && creditEntitys.length > 0) {
      if (entityAns) {
        formikCredit.setFieldValue(
          "entryId",
          creditEntitys[creditEntitys.length - 1]._id
        );
        setForceAdd((oldData) => ({
          ...oldData,
          C: false,
        }));
      } else {
        setForceAdd((oldData) => ({
          ...oldData,
          C: true,
        }));
        formikCredit.setFieldValue("entryId", null);
      }
    } else {
      setForceAdd((oldData) => ({
        ...oldData,
        C: true,
      }));
      formikCredit.setFieldValue("entryId", null);
    }
  }, [creditEntitys]);

  useEffect(() => {
    if (debitEntitys && debitEntitys.length > 0) {
      // if (debitEntitys.length === 1 && entityAns) {
      if (entityAns) {
        formikDebit.setFieldValue(
          "entryId",
          debitEntitys[debitEntitys.length - 1]._id
        );
        setForceAdd((oldData) => ({
          ...oldData,
          D: false,
        }));
      } else {
        setForceAdd((oldData) => ({
          ...oldData,
          D: true,
        }));
        formikDebit.setFieldValue("entryId", null);
      }
    } else {
      setForceAdd((oldData) => ({
        ...oldData,
        D: true,
      }));
      formikDebit.setFieldValue("entryId", null);
    }
  }, [debitEntitys]);

  useEffect(() => {
    if (forceAdd.C) {
      formikCredit.validateForm().then(() => {
        // console.log(
        //   "formikCredit Validation after forceAdd",
        //   formikCredit.isValid
        // );
      });
    }
    if (forceAdd.D) {
      formikDebit.validateForm().then(() => {
        // console.log(
        //   "formikDebit Validation after forceAdd",
        //   formikDebit.isValid
        // );
      });
    }
  }, [forceAdd]);

  // AUTOSUBMIT
  useEffect(() => {
    if (
      formikCredit.isValid &&
      formikCredit.dirty &&
      formikCredit.values.byWhom === creditByWhom
    ) {
      const outerTimeout = setTimeout(() => {
        // console.log('start', new Date());
        setOpenAutoSubmit([true, false]);
        const innerTimeout = setTimeout(() => {
          formikCredit.submitForm();
        }, 2000); // 5 seconds

        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds

      return () => clearTimeout(outerTimeout);
    }
  }, [formikCredit.values, formikCredit.isValid, creditByWhom]);
  // sfjhsjkdfsdfj
  useEffect(() => {
    if (
      formikDebit.isValid &&
      formikDebit.dirty &&
      formikDebit.values.byWhom === debitByWhom
    ) {
      const outerTimeout = setTimeout(() => {
        // console.log('start', new Date());
        setOpenAutoSubmit([false, true]);
        const innerTimeout = setTimeout(() => {
          formikDebit.submitForm();
        }, 2000); // 5 seconds

        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds

      return () => clearTimeout(outerTimeout);
    }
  }, [formikDebit.values, formikDebit.isValid, debitByWhom]);

  const handelCancel = (data, setIsWritingState, formik) => {
    setMemberId((oldData) => ({ ...oldData, [formik.values.type]: "" }));
    setIsWritingState(false);
    setOpenAutoSubmit(data);
    formik.resetForm();
    dispatch(setCreditEntitys([]));
    dispatch(setDebitEntitys([]));
    if (secondCancelFunc) {
      secondCancelFunc();
    }
  };
  
  useEffect(() => {
    setFirstCancelFunc(() => handelCancel);
  }, []);

  return (
    <div className={Style.mainWriteBox}>
      <div className={Style.mainBox}>
        {/* --------------------------------------------- Credit Box ---------------------------------------- */}
        {openAutoSubmit[0] ? (
          <div className={Style.creditBox}>
            <div className={Style.autoSumitBox}>
              <CircularProgress size={50} />
              <h3>Submitting Please Wait ..</h3>
              {!removeCancelBtn && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() =>
                    handelCancel(
                      [false, false, false],
                      setIsCreditWriting,
                      formikCredit
                    )
                  }
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className={Style.creditBox}>
            <div
              className={
                isCreditWriting ? Style.isCreditWriteBox : Style.writeBox
              }
            >
              {isCreditWriting && (
                <div className="flex">
                  <IconButton
                    size="small"
                    className={Style.closeBtn}
                    onClick={() => {
                      setForceAdd((old) => ({ ...old, C: false }));
                      setIsCreditWriting(false);
                      dispatch(setCreditEntitys([]));
                    }}
                  >
                    <ClearSharp
                      fontSize="small"
                      sx={{ color: "#fff", fontSize: "10px" }}
                    />
                  </IconButton>
                  <div
                    style={{
                      backgroundColor: "#E3FFC7",
                      minWidth: "16.8rem",
                    }}
                    className="flex"
                  >
                    <div style={{ minWidth: "11rem" }}>
                      <h5>{formikCredit.values.inputText}</h5>
                    </div>
                    <div style={{ minWidth: "3.3rem" }}>
                      <h5>{formikCredit.values.amount}</h5>
                    </div>
                  </div>
                </div>
              )}
              <div
                style={{
                  width: "100%",
                }}
                className={`flex ${isCreditWriting ? Style.subWriteBox : ""}`}
                onClick={() => setIsCreditWriting(true)}
              >
                <div className={Style.nameBox}>
                  <WriteDivField
                    customClass={Style.writeInput}
                    style={{
                      backgroundColor: isCreditWriting ? "#E3FFC7" : "white",
                    }}
                    handleInput={handleCreditInput}
                    placeholder={"નામ"}
                  />
                </div>
                <div className={Style.byWhomBox}>
                  <WriteDivField
                    customClass={Style.writeInput}
                    style={{
                      backgroundColor: isCreditWriting ? "#E3FFC7" : "white",
                    }}
                    handleInput={handleCreditByWhom}
                    placeholder={"હસ્તે"}
                  />
                </div>
                {/* <div className={Style.amtBox}>
                    <WriteDivField
                      customClass={Style.writeInput}
                      style={{
                        backgroundColor: isCreditWriting ? "#E3FFC7" : "white",
                      }}
                      handleInput={(e) => {
                        handelAmtInput(e, formikCredit);
                      }}
                      placeholder={"રકમ"}
                    />
                  </div> */}
              </div>
              {isCreditWriting && (
                <div className={Style.amountBox}>
                  <div
                    style={{ width: "50%", borderRight: "1px solid lightGray" }}
                  >
                    <WriteDivField
                      handleInput={(e) => handelAmtInput(e, formikCredit, "C")}
                      customClass={Style.incomeAmountTextBox}
                      placeholder="Cash Amount"
                      style={{ width: "100%", backgroundColor: "#E3FFC7" }}
                    />
                  </div>
                  <div style={{ width: "50%" }}>
                    <WriteDivField
                      handleInput={(e) => handelAmtInput(e, formikCredit, "O")}
                      customClass={Style.incomeAmountTextBox}
                      placeholder="Online Amount"
                      style={{ width: "100%", backgroundColor: "#E3FFC7" }}
                    />
                  </div>
                </div>
              )}
            </div>
            {isCreditWriting && (
              <div className={Style.creditSelectBox}>
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
                              item._id === formikCredit.values.entryId
                                ? Style.creditSelectedEntOption
                                : Style.creditEntOption
                            }
                            onClick={() => {
                              setForceAdd((old) => ({ ...old, C: false }));
                              formikCredit.setFieldValue("entryId", item._id);
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
            {/* {selectMemberHtml("C", formikCredit)} */}
          </div>
        )}

        {/* --------------------------------------------- Debit Box ---------------------------------------- */}
        {openAutoSubmit[1] ? (
          <div className={Style.creditBox}>
            <div className={Style.autoSumitBox}>
              <CircularProgress size={50} />
              <h3>Submitting Please Wait ..</h3>
              {!removeCancelBtn && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() =>
                    handelCancel(
                      [false, false, false],
                      setIsDebitWriting,
                      formikDebit
                    )
                  }
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className={Style.debitBox}>
            <div
              className={
                isDebitWriting ? Style.isDebitWriteBox : Style.writeBox
              }
            >
              {isDebitWriting && (
                <div className="flex gap-05">
                  <IconButton
                    size="small"
                    className={Style.closeBtn}
                    onClick={() => {
                      setForceAdd((old) => ({ ...old, D: false }));
                      setIsDebitWriting(false);
                      dispatch(setDebitEntitys([]));
                    }}
                  >
                    <ClearSharp
                      fontSize="small"
                      sx={{ color: "#fff", fontSize: "10px" }}
                    />
                  </IconButton>
                  <div
                    style={{
                      backgroundColor: "#FBCECD",
                      minWidth: "16.3rem",
                    }}
                    className="flex"
                  >
                    <div style={{ minWidth: "11rem" }}>
                      <h5>{formikDebit.values.inputText}</h5>
                    </div>
                    <div style={{ minWidth: "3.3rem" }}>
                      <h5>{formikDebit.values.amount}</h5>
                    </div>
                  </div>
                </div>
              )}
              <div
                style={{
                  width: "100%",
                }}
                className={`flex ${isDebitWriting ? Style.subWriteBox : ""}`}
                onClick={() => setIsDebitWriting(true)}
              >
                <div className={Style.nameBox}>
                  <WriteDivField
                    customClass={Style.writeInput}
                    style={{
                      backgroundColor: isDebitWriting ? "#FBCECD" : "white",
                    }}
                    handleInput={handleDebitInput}
                    placeholder={"નામ"}
                    // handleBlur={handleBlur}
                  />
                </div>
                <div className={Style.byWhomBox}>
                  <WriteDivField
                    customClass={Style.writeInput}
                    style={{
                      backgroundColor: isDebitWriting ? "#FBCECD" : "white",
                    }}
                    handleInput={handleDebitByWhom}
                    placeholder={"હસ્તે"}
                  />
                </div>

                {/* <div className={Style.amtBox}>
                    <WriteDivField
                      customClass={Style.writeInput}
                      style={{
                        backgroundColor: isDebitWriting ? "#FBCECD" : "white",
                      }}
                      handleInput={(e) => {
                        handelAmtInput(e, formikDebit);
                      }}
                      placeholder={"રકમ"}
                      // handleBlur={handleBlur}
                    />
                  </div> */}
              </div>
              {isDebitWriting && (
                <div className={Style.amountBox}>
                  <div
                    style={{ width: "50%", borderRight: "1px solid lightGray" }}
                  >
                    <WriteDivField
                      handleInput={(e) => handelAmtInput(e, formikDebit, "C")}
                      customClass={Style.incomeAmountTextBox}
                      placeholder="Cash Amount"
                      style={{ width: "100%", backgroundColor: "#FBCECD" }}
                    />
                  </div>
                  <div style={{ width: "50%" }}>
                    <WriteDivField
                      handleInput={(e) => handelAmtInput(e, formikDebit, "O")}
                      customClass={Style.incomeAmountTextBox}
                      placeholder="Online Amount"
                      style={{ width: "100%", backgroundColor: "#FBCECD" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {isDebitWriting && (
              <div className={Style.debitSelectBox}>
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
                              item._id === formikDebit.values.entryId
                                ? Style.creditSelectedEntOption
                                : Style.creditEntOption
                            }
                            onClick={() => {
                              setForceAdd((old) => ({ ...old, D: false }));
                              formikDebit.setFieldValue("entryId", item._id);
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
