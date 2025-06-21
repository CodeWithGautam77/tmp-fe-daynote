import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import BorrowWriteStyle from "./borrowWriteEntry.module.scss";
import { toast } from "react-toastify";
import { Button, CircularProgress, IconButton } from "@mui/material";
import _ from "lodash";
import {
  calculatePercentageAmount,
  phoneConvertGujaratiToEnglish,
  removeEnglishWords,
} from "../../common/common";
import moment from "moment";
import WriteDivField from "../../components/WriteDivField";
import CustomerDialog from "../Dailogs/CustomerDialog";
import SupplierDialog from "../Dailogs/SupplierDialog";
import {
  getMatchingCreditEntitys,
  getMatchingDebitEntitys,
  setCreditEntitys,
  setDebitEntitys,
} from "../../apis/entitySlice";
import AddIcon from "@mui/icons-material/Add";
import { ClearSharp } from "@mui/icons-material";
import { addBorrowEntry, addForceBorrowEntry } from "../../apis/borrowSlice";

export default function BorrowWriteEntry() {
  const currentDate = useSelector((state) => state.date.currentDate);

  const dispatch = useDispatch();
  // const creditEditableDivRef = useRef(null);

  const { loggedIn } = useSelector((state) => state.authData);
  const { creditEntitys, debitEntitys, entLoading, entityAns } = useSelector(
    (state) => state.entData
  );
  const { buyDayTotalAmt, sellDayTotalAmt } = useSelector(
    (state) => state.borrowData
  );

  const [openAutoSubmit, setOpenAutoSubmit] = useState([false, false]);
  const [isAddNew, setIsAddNew] = useState(false);
  const [openCustomerDialog, setOpenCustomerDialog] = useState([
    false,
    null,
    null,
  ]);
  const [openSupplierDialog, setOpenSupplierDialog] = useState([
    false,
    null,
    null,
  ]);

  const [isSellWriting, setIsSellWriting] = useState(false);
  const [isBuyWriting, setIsBuyWriting] = useState(false);
  const [forceAdd, setForceAdd] = useState({
    S: false,
    B: false,
  });
  const [buyBillNo, setBuyBillNo] = useState("");
  const [sellBillNo, setSellBillNo] = useState("");

  const sellValidationSchema = yup.object({
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

  const buyValidationSchema = yup.object({
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

  const formikSell = useFormik({
    initialValues: {
      date: "",
      entryId: "",
      amount: "",
      type: "S",
      inputText: "",
      billNo: "",
      // etype: "",
    },
    validationSchema: forceAdd.S ? forceValidationSchema : sellValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSellWriting(false);
      const cutOffPercentage = loggedIn?.cutOff || null;

      console.log("formikSell Values-->", {
        ...values,
        // etype: "C",
        uId: loggedIn._id,
        date: moment(currentDate)?.format("YYYY-MM-DD"),
        amount: cutOffPercentage
          ? calculatePercentageAmount(values?.amount, cutOffPercentage)
          : values?.amount,
      });

      let response = null;
      if (forceAdd.S) {
        response = await dispatch(
          addForceBorrowEntry({
            ...values,
            uId: loggedIn._id,
            date: moment(currentDate)?.format("YYYY-MM-DD"),
            amount: cutOffPercentage
              ? calculatePercentageAmount(values?.amount, cutOffPercentage)
              : values?.amount,
          })
        );
      } else {
        response = await dispatch(
          addBorrowEntry({
            ...values,
            uId: loggedIn._id,
            date: moment(currentDate)?.format("YYYY-MM-DD"),
            amount: cutOffPercentage
              ? calculatePercentageAmount(values?.amount, cutOffPercentage)
              : values?.amount,
            isOpen: false,
          })
        );
      }
      // console.log(response)
      if (!response.payload.error) {
        toast.success(response.payload.message);
        setOpenAutoSubmit([false, false]);
        dispatch(setCreditEntitys([]));
        resetForm();
        setIsAddNew(false);
        // setIsSellWriting(false);
      } else {
        toast.error(response.payload.message);
        setOpenAutoSubmit([false, false]);
        dispatch(setCreditEntitys([]));
        resetForm();
        setIsAddNew(false);
        setIsSellWriting(false);
      }
      setForceAdd({
        S: false,
        B: false,
      });
    },
  });

  const formikBuy = useFormik({
    initialValues: {
      date: "",
      entryId: "",
      amount: "",
      type: "B",
      inputText: "",
      billNo: "",
      // etype: "",
    },
    validationSchema: forceAdd.B ? forceValidationSchema : buyValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsBuyWriting(false);
      const cutOffPercentage = loggedIn?.cutOff || null;
      console.log("formikBuy Values-->", {
        ...values,
        // etype: "S",
        uId: loggedIn._id,
        date: moment(currentDate)?.format("YYYY-MM-DD"),
        amount: cutOffPercentage
          ? calculatePercentageAmount(values?.amount, cutOffPercentage)
          : values?.amount,
      });
      setIsAddNew(false);

      let response = null;
      if (forceAdd.B) {
        response = await dispatch(
          addForceBorrowEntry({
            ...values,
            uId: loggedIn._id,
            date: moment(currentDate)?.format("YYYY-MM-DD"),
            amount: cutOffPercentage
              ? calculatePercentageAmount(values?.amount, cutOffPercentage)
              : values?.amount,
          })
        );
      } else {
        response = await dispatch(
          addBorrowEntry({
            ...values,
            uId: loggedIn._id,
            date: moment(currentDate)?.format("YYYY-MM-DD"),
            amount: cutOffPercentage
              ? calculatePercentageAmount(values?.amount, cutOffPercentage)
              : values?.amount,
            isOpen: false,
          })
        );
      }
      // console.log(response)
      if (!response.payload.error) {
        toast.success(response.payload.message);
        dispatch(setDebitEntitys([]));
        resetForm();
        setIsAddNew(false);
        setIsBuyWriting(false);
      } else {
        toast.error(response.payload.message);
        setOpenAutoSubmit([false, false]);
        dispatch(setDebitEntitys([]));
        resetForm();
        setIsAddNew(false);
        setIsBuyWriting(false);
      }
      setForceAdd({
        S: false,
        B: false,
      });
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

  const handleSellInput = (event) => {
    const value = event.target.textContent;
    const updatedValue = removeEnglishWords(value);
    formikSell.setFieldValue("inputText", updatedValue);

    if (!isAddNew) {
      sellDebouncedSearch(value);
    }
  };

  const handleBuyInput = (event) => {
    const value = event.target.textContent;
    const updatedValue = removeEnglishWords(value);
    formikBuy.setFieldValue("inputText", updatedValue);

    if (!isAddNew) {
      buyDebouncedSearch(updatedValue);
    }
  };

  const sellDebouncedSearch = useCallback(
    _.debounce(async (searchName) => {
      const withoutspace = searchName.replace(/\s+/g, "");
      const result = searchName.replace(/માલપરત/g, "").trim();
      // console.log(result);
      if (result) {
        const response = await dispatch(
          getMatchingCreditEntitys({
            uId: loggedIn?._id,
            type: "C",
            entName: result,
          })
        );
        // console.log("Credit response", response);
        if (response.payload?.error) {
          toast.error(response.payload.message);
        }
      }
    }, 2000),
    [loggedIn]
  );

  const buyDebouncedSearch = useCallback(
    _.debounce(async (searchName) => {
      // console.log("searchName -->", searchName);
      // console.log("type -->", type);
      const withoutspace = searchName.replace(/\s+/g, "");
      const result = searchName.replace(/માલપરત/g, "").trim();
      if (result) {
        const response = await dispatch(
          getMatchingDebitEntitys({
            uId: loggedIn?._id,
            type: "S",
            entName: result,
          })
        );
        // console.log("Deibt response", response);

        if (response.payload?.error) {
          toast.error(response.payload.message);
        }
      }
    }, 2000),
    [loggedIn]
  );

  useEffect(() => {
    if (isAddNew) {
      setForceAdd({
        S: false,
        B: false,
      });
    }
  }, [isAddNew]);

  useEffect(() => {
    if (!isAddNew && formikSell.values.inputText) {
      if (creditEntitys && creditEntitys.length > 0) {
        if (entityAns) {
          formikSell.setFieldValue(
            "entryId",
            creditEntitys[creditEntitys.length - 1]._id
          );
          setForceAdd((oldData) => ({
            ...oldData,
            S: false,
          }));
        } else {
          setForceAdd((oldData) => ({
            ...oldData,
            S: true,
          }));
          formikSell.setFieldValue("entryId", null);
        }
      } else {
        setForceAdd((oldData) => ({
          ...oldData,
          S: true,
        }));
        formikSell.setFieldValue("entryId", null);
      }
    }
  }, [creditEntitys]);

  useEffect(() => {
    if (!isAddNew && formikBuy.values.inputText) {
      if (debitEntitys && debitEntitys.length > 0) {
        if (entityAns) {
          formikBuy.setFieldValue(
            "entryId",
            debitEntitys[debitEntitys.length - 1]._id
          );
          setForceAdd((oldData) => ({
            ...oldData,
            B: false,
          }));
        } else {
          setForceAdd((oldData) => ({
            ...oldData,
            B: true,
          }));
          formikBuy.setFieldValue("entryId", null);
        }
      } else {
        setForceAdd((oldData) => ({
          ...oldData,
          B: true,
        }));
        formikBuy.setFieldValue("entryId", null);
      }
    }
  }, [debitEntitys]);

  useEffect(() => {
    if (forceAdd.S) {
      formikSell.validateForm().then(() => {});
    }
    if (forceAdd.B) {
      formikBuy.validateForm().then(() => {});
    }
  }, [forceAdd]);

  const handelAddNew = (wType) => {
    const openStateByType = {
      C: () => setOpenCustomerDialog([true, null, null]),
      S: () => setOpenSupplierDialog([true, null, null]),
    };

    openStateByType[wType]();

    setIsAddNew(true);
  };

  const handleBuyBillNo = (event) => {
    const value = event.target.textContent;

    formikBuy.setFieldValue("billNo", value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setBuyBillNo(formikBuy.values.billNo);
    }, 500); // Adjust debounce time as needed

    return () => clearTimeout(handler); // Cleanup previous timeout
  }, [formikBuy.values.billNo]);

  const handleSellBillNo = (event) => {
    const value = event.target.textContent;

    formikSell.setFieldValue("billNo", value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSellBillNo(formikSell.values.billNo);
    }, 500); // Adjust debounce time as needed

    return () => clearTimeout(handler); // Cleanup previous timeout
  }, [formikSell.values.billNo]);

  useEffect(() => {
    if (
      formikSell.isValid &&
      formikSell.dirty &&
      formikSell.values.billNo === sellBillNo
    ) {
      const outerTimeout = setTimeout(() => {
        setOpenAutoSubmit([false, true]);
        const innerTimeout = setTimeout(() => {
          formikSell.submitForm();
          setOpenAutoSubmit([false, false]);
        }, 2000); // 5 seconds
        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds
      return () => clearTimeout(outerTimeout);
    }
  }, [formikSell.values, formikSell.isValid, sellBillNo]);

  useEffect(() => {
    if (
      formikBuy.isValid &&
      formikBuy.dirty &&
      formikBuy.values.billNo === buyBillNo
    ) {
      const outerTimeout = setTimeout(() => {
        setOpenAutoSubmit([true, false]);
        const innerTimeout = setTimeout(() => {
          formikBuy.submitForm();
          setOpenAutoSubmit([false, false]);
        }, 2000); // 5 seconds
        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds
      return () => clearTimeout(outerTimeout);
    }
  }, [formikBuy.values, formikBuy.isValid, buyBillNo]);

  const handelCancel = (data, setIsWriting, formik) => {
    setIsWriting(false);
    setOpenAutoSubmit(data);

    formik.resetForm();
  };

  return (
    <div>
      <div className={BorrowWriteStyle.mainBox}>
        {/* --------------------------------------------- Buy Box ---------------------------------------- */}
        {openAutoSubmit[0] ? (
          <div className={BorrowWriteStyle.creditBox}>
            <label className={`${BorrowWriteStyle.inputLabel} gradient-text`}>
              ખરીદ :
            </label>
            <div className={BorrowWriteStyle.autoSumitBox}>
              <CircularProgress size={50} />
              <h3>Submitting Please Wait ..</h3>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() =>
                  handelCancel([false, false], setIsBuyWriting, formikBuy)
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className={BorrowWriteStyle.creditBox}>
            <label className={`${BorrowWriteStyle.inputLabel} gradient-text`}>
              ખરીદ :
            </label>

            <div
              className={
                isBuyWriting
                  ? BorrowWriteStyle.isDebitWriteBox
                  : BorrowWriteStyle.writeBox
              }
            >
              {isBuyWriting && (
                <div className="flex" style={{ marginBottom: ".3rem" }}>
                  <IconButton
                    size="small"
                    className={BorrowWriteStyle.closeBtn}
                    onClick={() => {
                      setIsBuyWriting(false);
                      dispatch(setDebitEntitys([]));
                    }}
                  >
                    <ClearSharp
                      fontSize="small"
                      sx={{ color: "#fff", fontSize: "10px" }}
                    />
                  </IconButton>
                  <div style={{ backgroundColor: "#E3FFC7" }} className="flex">
                    <div style={{ minWidth: "15rem" }}>
                      {formikBuy.values.inputText}
                    </div>
                    <div style={{ minWidth: "6.5rem" }}>
                      {formikBuy.values.amount}
                    </div>
                  </div>
                </div>
              )}
              <div
                style={{
                  width: "100%",
                }}
                className={`${
                  isBuyWriting ? BorrowWriteStyle.subWriteBox : ""
                }`}
                onClick={() => setIsBuyWriting(true)}
              >
                <div className="flex w-100">
                  <div className={BorrowWriteStyle.nameBox}>
                    <WriteDivField
                      style={{
                        backgroundColor: isBuyWriting ? "#E3FFC7" : "white",
                      }}
                      customClass={BorrowWriteStyle.writeInput}
                      handleInput={handleBuyInput}
                      placeholder="નામ"
                    />
                  </div>

                  <div className={BorrowWriteStyle.amtBox}>
                    <WriteDivField
                      style={{
                        backgroundColor: isBuyWriting ? "#E3FFC7" : "white",
                      }}
                      customClass={BorrowWriteStyle.writeInput}
                      handleInput={(e) => {
                        handelAmtInput(e, formikBuy);
                      }}
                      placeholder={"રકમ"}
                    />
                  </div>
                </div>
                <div style={{ width: "100%", borderTop: "1px solid #7e7474" }}>
                  <WriteDivField
                    style={{
                      backgroundColor: isBuyWriting ? "#E3FFC7" : "white",
                    }}
                    customClass={BorrowWriteStyle.writeInput}
                    handleInput={handleBuyBillNo}
                    placeholder="બિલ નંબર"
                  />
                </div>
              </div>
            </div>

            {isBuyWriting && (
              <div className={BorrowWriteStyle.debitSelectBox}>
                {entLoading ? (
                  <div
                    style={{ width: "100%", height: "12rem" }}
                    className="flexCenter"
                  >
                    <CircularProgress size={50} />
                  </div>
                ) : (
                  <>
                    <div
                      className={BorrowWriteStyle.addNewOption}
                      onClick={() => handelAddNew("S")}
                    >
                      <AddIcon fontSize="small" /> Add New
                    </div>
                    {debitEntitys.length > 0 ? (
                      <>
                        {debitEntitys.map((item, index) => (
                          <option
                            key={index}
                            value={item._id}
                            className={
                              item._id === formikBuy.values.entryId
                                ? BorrowWriteStyle.creditSelectedEntOption
                                : BorrowWriteStyle.creditEntOption
                            }
                            onClick={() => {
                              setForceAdd((old) => ({ ...old, B: false }));
                              formikBuy.setFieldValue("entryId", item._id);
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
                            {item.searchName} - {item?.type}
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

        {/* --------------------------------------------- Sell Box ---------------------------------------- */}
        {openAutoSubmit[1] ? (
          <div className={BorrowWriteStyle.creditBox}>
            <label className={`${BorrowWriteStyle.inputLabel} gradient-text`}>
              વેચાણ :
            </label>
            <div className={BorrowWriteStyle.autoSumitBox}>
              <CircularProgress size={50} />
              <h3>Submitting Please Wait ..</h3>
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  handelCancel([false, false], setIsSellWriting, formikSell)
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className={BorrowWriteStyle.debitBox}>
            <label className={`${BorrowWriteStyle.inputLabel} gradient-text`}>
              વેચાણ :
            </label>

            <div
              className={
                isSellWriting
                  ? BorrowWriteStyle.isCreditWriteBox
                  : BorrowWriteStyle.writeBox
              }
            >
              {isSellWriting && (
                <div className="flex" style={{ marginBottom: ".3rem" }}>
                  <IconButton
                    size="small"
                    className={BorrowWriteStyle.closeBtn}
                    onClick={() => {
                      setIsSellWriting(false);
                      dispatch(setCreditEntitys([]));
                    }}
                  >
                    <ClearSharp
                      fontSize="small"
                      sx={{ color: "#fff", fontSize: "10px" }}
                    />
                  </IconButton>
                  <div style={{ backgroundColor: "#FBCECD" }} className="flex">
                    <div style={{ minWidth: "15rem" }}>
                      {formikSell.values.inputText}
                    </div>
                    <div style={{ minWidth: "6.5rem" }}>
                      {formikSell.values.amount}
                    </div>
                  </div>
                </div>
              )}
              <div
                style={{
                  width: "100%",
                }}
                className={`${
                  isSellWriting ? BorrowWriteStyle.subWriteBox : ""
                }`}
                onClick={() => setIsSellWriting(true)}
              >
                <div className="w-100 flex">
                  <div className={BorrowWriteStyle.nameBox}>
                    <WriteDivField
                      style={{
                        backgroundColor: isSellWriting ? "#FBCECD" : "white",
                      }}
                      customClass={BorrowWriteStyle.writeInput}
                      handleInput={handleSellInput}
                      placeholder="નામ"
                    />
                  </div>

                  <div className={BorrowWriteStyle.amtBox}>
                    <WriteDivField
                      style={{
                        backgroundColor: isSellWriting ? "#FBCECD" : "white",
                      }}
                      customClass={BorrowWriteStyle.writeInput}
                      handleInput={(e) => {
                        handelAmtInput(e, formikSell);
                      }}
                      placeholder={"રકમ"}
                    />
                  </div>
                </div>
                <div style={{ width: "100%", borderTop: "1px solid #7e7474" }}>
                  <WriteDivField
                    style={{
                      backgroundColor: isSellWriting ? "#FBCECD" : "white",
                    }}
                    customClass={BorrowWriteStyle.writeInput}
                    handleInput={handleSellBillNo}
                    placeholder="બિલ નંબર"
                  />
                </div>
              </div>
            </div>

            {isSellWriting && (
              <div className={BorrowWriteStyle.creditSelectBox}>
                {entLoading ? (
                  <div
                    style={{ width: "100%", height: "12rem" }}
                    className="flexCenter"
                  >
                    <CircularProgress size={50} />
                  </div>
                ) : (
                  <>
                    <div
                      className={BorrowWriteStyle.addNewOption}
                      onClick={() => handelAddNew("C")}
                    >
                      <AddIcon fontSize="small" /> Add New
                    </div>
                    {creditEntitys.length > 0 ? (
                      <>
                        {creditEntitys.map((item, index) => (
                          <option
                            key={index}
                            value={item._id}
                            className={
                              item._id === formikSell.values.entryId
                                ? BorrowWriteStyle.creditSelectedEntOption
                                : BorrowWriteStyle.creditEntOption
                            }
                            onClick={() => {
                              setForceAdd((old) => ({ ...old, S: false }));
                              formikSell.setFieldValue("entryId", item._id);
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
                            {item.searchName} - {item?.type}
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
      {openCustomerDialog[0] && (
        <CustomerDialog
          openCustomerDialog={openCustomerDialog}
          setOpenCustomerDialog={setOpenCustomerDialog}
          setIsAddNew={setIsAddNew}
          formikSell={formikSell}
          setOpenAutoSubmit={setOpenAutoSubmit}
          setIsSellWriting={setIsSellWriting}
        />
      )}
      {openSupplierDialog[0] && (
        <SupplierDialog
          openSupplierDialog={openSupplierDialog}
          setOpenSupplierDialog={setOpenSupplierDialog}
          setIsAddNew={setIsAddNew}
          formikBuy={formikBuy}
          setOpenAutoSubmit={setOpenAutoSubmit}
          setIsBuyWriting={setIsBuyWriting}
        />
      )}
    </div>
  );
}
