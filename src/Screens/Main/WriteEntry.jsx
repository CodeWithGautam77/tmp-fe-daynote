import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import MainStyle from "./main.module.scss";
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
  extractWord,
  getEType,
  phoneConvertGujaratiToEnglish,
  removeEnglishWords,
  removeSuffix,
} from "../../common/common";
import CustomSelectField from "../../components/CustomSelectField";
import moment from "moment";
import WriteDivField from "../../components/WriteDivField";
import {
  getMatchingCreditEntitys,
  getMatchingDebitEntitys,
  setCreditEntitys,
  setDebitEntitys,
} from "../../apis/entitySlice";
import {
  addForceMainEntry,
  addMainCashDayTotal,
  addMainEntry,
  addTempBorrowEntry,
  getMainEntrysByDate,
} from "../../apis/mainSlice";
import { ClearSharp } from "@mui/icons-material";
import { searchMember } from "../../apis/teamSlice";

export default function WriteEntry({ handleShowTotal, showTotalAmount }) {
  const currentDate = useSelector((state) => state.date.currentDate);

  const dispatch = useDispatch();

  const { loggedIn } = useSelector((state) => state.authData);
  const { creditEntitys, debitEntitys, entityAns, entLoading } = useSelector(
    (state) => state.entData
  );
  const { teamLoading } = useSelector((state) => state.teamData);
  const { cities } = useSelector((state) => state.citiesData);
  const {
    cashEntryLoading,
    creditAcc,
    debitAcc,
    debitDayTotalAmt,
    creditDayTotalAmt,
  } = useSelector((state) => state.mainData);

  const [team, setTeam] = useState([]);

  const [memberId, setMemberId] = useState({
    C: "",
    D: "",
  });

  const [isAmtBoxOpen, setIsAmtBoxOpen] = useState({
    C: false,
    D: false,
  });

  const [openAutoSubmit, setOpenAutoSubmit] = useState([false, false, false]);
  const [isAddNew, setIsAddNew] = useState(false);

  const [forceAdd, setForceAdd] = useState({
    C: false,
    D: false,
  });

  const [isCashWriting, setIsCashWriting] = useState(false);
  const [isCreditWriting, setIsCreditWriting] = useState(false);
  const [isDebitWriting, setIsDebitWriting] = useState(false);
  const [isTempBorrowWriting, setIsTempBorrowWriting] = useState(false);
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

  const TempBorrowValidationSchema = yup.object({
    entName: yup.string().required("Please enter name"),
    amount: yup
      .string()
      .required("Please enter amount")
      .test(
        "not-zero",
        "Amount cannot be zero",
        (value) => value && !/^[0]+$/.test(value)
      ),
  });

  const CashValidationSchema = yup.object({
    entName: yup
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
      type: "C",
      entName: "",
      inputText: "",
      etype: "",
      byWhom: "",
    },
    validationSchema: forceAdd.C ? forceValidationSchema : ValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setOpenAutoSubmit([false, false, false]);
      setIsCreditWriting(false);
      setRemoveCancelBtn(true);
      const type = getEType(values.inputText);
      let finalData = {
        ...values,
        etype: values.etype ? values.etype : type ? type : "C",
        uId: loggedIn._id,
        date: moment(currentDate)?.format("YYYY-MM-DD"),
      };
      if (finalData.etype !== "MR") {
        const cutOffPercentage = loggedIn?.cutOff || null;
        finalData.amount = cutOffPercentage
          ? calculatePercentageAmount(finalData.amount, cutOffPercentage)
          : finalData.amount;
      }
      console.log("finalData", finalData);
      let response = null;
      if (forceAdd.C) {
        response = await dispatch(addForceMainEntry(finalData));
        //   addForceMainEntry({
        //     ...values,
        //     etype: values.etype ? values.etype : type ? type : "C",
        //     uId: loggedIn._id,
        //     date: moment(currentDate)?.format("YYYY-MM-DD"),
        //   })
        // );
      } else {
        response = await dispatch(
          addMainEntry(finalData)
          // addMainEntry({
          //   ...values,
          //   etype: values.etype ? values.etype : type ? type : "C",
          //   uId: loggedIn._id,
          //   date: moment(currentDate)?.format("YYYY-MM-DD"),
          // })
        );
      }

      if (!response.payload.error) {
        toast.success(response.payload.message);
        setForceAdd({
          C: false,
          D: false,
        });
        setIsAmtBoxOpen({
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
        setIsAmtBoxOpen({
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
      type: "D",
      entName: "",
      inputText: "",
      etype: "",
      byWhom: "",
    },
    validationSchema: forceAdd.D ? forceValidationSchema : ValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setOpenAutoSubmit([false, false, false]);
      setIsDebitWriting(false);
      setRemoveCancelBtn(true);
      const type = getEType(values.inputText);
      let finalData = {
        ...values,
        etype: values.etype ? values.etype : type ? type : "S",
        uId: loggedIn._id,
        date: moment(currentDate)?.format("YYYY-MM-DD"),
      };
      if (finalData.etype !== "MR") {
        const cutOffPercentage = loggedIn?.cutOff || null;
        finalData.amount = cutOffPercentage
          ? calculatePercentageAmount(finalData.amount, cutOffPercentage)
          : finalData.amount;
      }
      console.log("formikDebit finalData-->", finalData);
      let response = null;
      if (forceAdd.D) {
        response = await dispatch(
          addForceMainEntry(finalData)
          // addForceMainEntry({
          //   ...values,
          //   etype: values.etype ? values.etype : type ? type : "S",
          //   uId: loggedIn._id,
          //   date: moment(currentDate)?.format("YYYY-MM-DD"),
          // })
        );
      } else {
        response = await dispatch(
          addMainEntry(finalData)
          // addMainEntry({
          //   ...values,
          //   etype: values.etype ? values.etype : type ? type : "S",
          //   uId: loggedIn._id,
          //   date: moment(currentDate)?.format("YYYY-MM-DD"),
          // })
        );
      }

      if (!response.payload.error) {
        toast.success(response.payload.message);
        setForceAdd({
          C: false,
          D: false,
        });
        setIsAmtBoxOpen({
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
        setIsAmtBoxOpen({
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

  const formikTempBorrow = useFormik({
    initialValues: {
      entName: "",
      entArea: "",
      entPhone: "",
      amount: "",
    },
    validationSchema: TempBorrowValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsTempBorrowWriting(false);
      setRemoveCancelBtn(true);
      const cutOffPercentage = loggedIn?.cutOff || null;
      const response = await dispatch(
        addTempBorrowEntry({
          ...values,
          uId: loggedIn._id,
          date: moment(currentDate)?.format("YYYY-MM-DD"),
          // amount: (parseFloat(values.amount) * 0.1).toFixed(2),
          amount: cutOffPercentage
            ? calculatePercentageAmount(values.amount, cutOffPercentage)
            : values.amount,
        })
      );
      if (!response.payload.error) {
        toast.success(response.payload.message);
        resetForm();
        setIsAddNew(false);
        setIsTempBorrowWriting(false);
        setRemoveCancelBtn(false);
      } else {
        // toast.error(response.payload.message);
        setOpenAutoSubmit([false, false, false]);
        resetForm();
        setIsAddNew(false);
        setIsTempBorrowWriting(false);
        setRemoveCancelBtn(false);
      }
    },
  });

  const formikCashTotal = useFormik({
    initialValues: {
      entName: "",
    },
    validationSchema: CashValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsCashWriting(false);
      setRemoveCancelBtn(true);
      const cutOffPercentage = loggedIn?.cutOff || null;

      console.log({
        ...values,
        entName: cutOffPercentage
          ? calculatePercentageAmount(values.entName, cutOffPercentage)
          : values.entName,
        uId: loggedIn._id,
        date: moment(currentDate)?.format("YYYY-MM-DD"),
      });
      const response = await dispatch(
        addMainCashDayTotal({
          ...values,
          entName: cutOffPercentage
            ? calculatePercentageAmount(values.entName, cutOffPercentage)
            : values.entName,
          uId: loggedIn._id,
          date: moment(currentDate)?.format("YYYY-MM-DD"),
        })
      );
      if (!response.payload.error) {
        toast.success(response.payload.message);
        resetForm();
        setIsCashWriting(false);
        dispatch(
          getMainEntrysByDate({
            uId: loggedIn?._id,
            date: moment(currentDate).format("YYYY-MM-DD"),
          })
        );
        setRemoveCancelBtn(false);
      } else {
        toast.error(response?.payload?.message);
        resetForm();
        setIsCashWriting(false);
        setRemoveCancelBtn(false);
      }
    },
  });

  useEffect(() => {
    if (loggedIn) {
      // async function getTeam() {
      //   const response = await dispatch(searchMember({ uId: loggedIn._id }));
      //   if (!response.payload.error) {
      //     setTeam(response?.payload?.data);
      //   }
      // }
      // getTeam();
    }
  }, [loggedIn]);

  // const handelMemberChange = (e, formik) => {
  //   const { value } = e.target;
  //   formik.setValues({
  //     ...formik.values,
  //     entryId: value,
  //     etype: `${formik?.values?.type}M`,
  //     type: "T",
  //   });
  //   setIsAmtBoxOpen((oldData) => ({
  //     ...oldData,
  //     [formik.values.type]: true,
  //   }));
  //   setMemberId((oldData) => ({
  //     ...oldData,
  //     [formik.values.type]: value,
  //   }));
  // };

  const handelCashInput = (event, formik) => {
    const value = event.target.textContent;
    if (value) {
      const translatedValue = phoneConvertGujaratiToEnglish(value);
      const isNumeric = /^\d+(\.\d+)?$/.test(`${translatedValue}`);
      if (isNumeric) {
        formik.setFieldValue("entName", `${translatedValue}`);
      }
    } else {
      formik.setFieldValue("entName", "");
    }
  };

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

  // useEffect(() => {
  //   if (formikCredit.values.amount && creditEntitys.length > 0) {
  //     setForceAdd((old) => ({ ...old, C: false }));
  //   }
  // }, [formikCredit.values.amount]);

  // useEffect(() => {
  //   if (formikDebit.values.amount && debitEntitys.length > 0) {
  //     setForceAdd((old) => ({ ...old, D: false }));
  //   }
  // }, [formikDebit.values.amount]);

  const handelPhoneInput = (event) => {
    const value = event.target.textContent;
    if (value) {
      const translatedValue = phoneConvertGujaratiToEnglish(value);
      const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
      if (isNumeric) {
        formikTempBorrow.setFieldValue("entPhone", translatedValue);
      }
    } else {
      formikTempBorrow.setFieldValue("entPhone", "");
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
  }, [formikCredit.values.inputText]);

  useEffect(() => {
    if (formikDebit.values.inputText && !formikDebit.values.etype) {
      const type = getEType(formikDebit.values.inputText);
      formikDebit.setFieldValue("etype", type);
    }
    if (!formikDebit.values.inputText) {
      formikDebit.setFieldValue("etype", "");
    }
  }, [formikDebit.values.inputText]);

  const handleSetEtype = (formik, type) => {
    if (formik.values.inputText) {
      if (type === "MR" && formik.values.etype === "M") {
        formik.setFieldValue("etype", "MR");
      } else if (type !== "MR" && !["M", "MR"].includes(formik.values.etype)) {
        formik.setFieldValue("etype", type);
      }
    }
  };

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
    const updatedValue = removeEnglishWords(value);
    formikCredit.setFieldValue("inputText", updatedValue);

    if (!isAddNew) {
      creditDebouncedSearch(updatedValue);
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
    const updatedValue = removeEnglishWords(value);
    formikDebit.setFieldValue("inputText", updatedValue);

    if (!isAddNew) {
      debitDebouncedSearch(updatedValue);
    }
  };

  const handleTempBorrowInput = (event, name) => {
    const value = event.target.textContent;
    const updatedValue = removeEnglishWords(value);
    if (updatedValue) {
      formikTempBorrow.setFieldValue(name, updatedValue);
    } else {
      formikTempBorrow.setFieldValue(name, "");
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
        formikCredit.setValues({
          ...formikCredit.values,
          entryId: creditEntitys[creditEntitys.length - 1]._id,
          etype: creditEntitys[creditEntitys.length - 1].type,
        });
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
        formikDebit.setValues({
          ...formikDebit.values,
          entryId: debitEntitys[debitEntitys.length - 1]._id,
          etype: debitEntitys[debitEntitys.length - 1].type,
        });
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
        setOpenAutoSubmit([true, false, false]);
        const innerTimeout = setTimeout(() => {
          formikCredit.submitForm();
          // console.log('end', new Date());
          // setOpenAutoSubmit([false, false, false]);
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
        setOpenAutoSubmit([false, true, false]);
        const innerTimeout = setTimeout(() => {
          formikDebit.submitForm();
          // setOpenAutoSubmit([false, false, false]);
          // console.log('end', new Date());
        }, 2000); // 5 seconds

        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds

      return () => clearTimeout(outerTimeout);
    }
  }, [formikDebit.values, formikDebit.isValid, debitByWhom]);

  useEffect(() => {
    if (formikTempBorrow.isValid && formikTempBorrow.dirty) {
      const outerTimeout = setTimeout(() => {
        // console.log('start', new Date());
        setOpenAutoSubmit([false, false, true]);
        const innerTimeout = setTimeout(() => {
          formikTempBorrow.submitForm();
          setOpenAutoSubmit([false, false, false]);
          // console.log('end', new Date());
        }, 2000); // 5 seconds

        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds

      return () => clearTimeout(outerTimeout);
    }
  }, [formikTempBorrow.values, formikTempBorrow.isValid]);

  useEffect(() => {
    if (formikCashTotal.isValid && formikCashTotal.dirty) {
      const outerTimeout = setTimeout(() => {
        // setOpenAutoSubmit([false, false, true]);
        const innerTimeout = setTimeout(() => {
          formikCashTotal.submitForm();
          // setOpenAutoSubmit([false, false, false]);
        }, 2000); // 5 seconds

        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds

      return () => clearTimeout(outerTimeout);
    }
  }, [formikCashTotal.values, formikCashTotal.isValid]);

  const handelCancel = (data, setIsWritingState, formik) => {
    setIsAmtBoxOpen((oldData) => ({ ...oldData, [formik.values.type]: false }));
    setMemberId((oldData) => ({ ...oldData, [formik.values.type]: "" }));
    setIsWritingState(false);
    setOpenAutoSubmit(data);
    formik.resetForm();
    dispatch(setCreditEntitys([]));
    dispatch(setDebitEntitys([]));
  };

  // const selectMemberHtml = (type, formik) => {
  //   return (
  //     <div className={MainStyle.bankSelectBox}>
  //       <div className="w-100">
  //         <FormControl fullWidth size="small">
  //           <InputLabel id="demo-simple-select-label">Select Member</InputLabel>
  //           <CustomSelectField
  //             label="Select Member"
  //             value={memberId[type]}
  //             id="entryId"
  //             name="entryId"
  //             onChange={(e) => handelMemberChange(e, formik)}
  //             disabled={teamLoading}
  //             onBlur={formik.handleBlur}
  //             menuArr={
  //               team && team.length > 0
  //                 ? team.map((item) => ({
  //                     value: item._id,
  //                     label: item.name,
  //                   }))
  //                 : []
  //             }
  //             error={formik.touched.entryId && Boolean(formik.errors.entryId)}
  //           />
  //         </FormControl>
  //       </div>
  //     </div>
  //   );
  // };

  const todayCashEntry = debitAcc.find((item) => item.etype === "CT");
  const previousCashEntry = creditAcc.find((item) => item.etype === "CT");
  return (
    <div className={MainStyle.mainWriteBox}>
      <div className={MainStyle.writeBtnGrp}>
        {!isCashWriting && (
          <>
            {cashEntryLoading ? (
              <Button className="btnRed">
                <CircularProgress size={22} sx={{ color: "white" }} />
              </Button>
            ) : (
              <Button className="btnRed" onClick={() => setIsCashWriting(true)}>
                સિલક
              </Button>
            )}
          </>
        )}

        {isCashWriting && (
          <div className={isCashWriting ? MainStyle.isCashWriteBox : ""}>
            {isCashWriting && (
              <IconButton
                size="small"
                className={MainStyle.closeBtn}
                onClick={() => setIsCashWriting(false)}
              >
                <ClearSharp
                  fontSize="small"
                  sx={{ color: "#fff", fontSize: "10px" }}
                />
              </IconButton>
            )}
            <div
              style={{
                width: "100%",
              }}
              // className={`${isCashWriting ? MainStyle.subWriteBox : ""}`}
            >
              {/* <div> */}
              <WriteDivField
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  height: isCashWriting ? "3.5rem" : "0rem",
                  borderRadius: ".3rem",
                }}
                // customClass={MainStyle.writeInput}
                handleInput={(e) => handelCashInput(e, formikCashTotal)}
                placeholder={"સિલક"}
                // handleBlur={handleBlur}
              />
              {/* </div> */}
            </div>
          </div>
        )}
        {!isCashWriting &&
        debitDayTotalAmt &&
        todayCashEntry &&
        creditDayTotalAmt &&
        previousCashEntry ? (
          <Button className="btnRed" onClick={handleShowTotal}>
            વકરો =&nbsp;
            {showTotalAmount
              ? (
                  debitDayTotalAmt +
                  todayCashEntry?.amount -
                  (creditDayTotalAmt + previousCashEntry?.amount)
                ).toLocaleString()
              : "XXXX"}
          </Button>
        ) : null}
      </div>
      <div className={MainStyle.mainBox}>
        {/* --------------------------------------------- Credit Box ---------------------------------------- */}
        {openAutoSubmit[0] ? (
          <div className={MainStyle.creditBox}>
            <label className={`${MainStyle.inputLabel} gradient-text`}>
              જમા :
            </label>
            <div className={MainStyle.autoSumitBox}>
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
          <div className={MainStyle.creditBox}>
            <label className={`${MainStyle.inputLabel} gradient-text`}>
              જમા :
            </label>

            {isAmtBoxOpen.C && (
              <div>
                <IconButton
                  size="small"
                  className={MainStyle.closeBtn}
                  onClick={() => {
                    setIsAmtBoxOpen((oldData) => ({ ...oldData, C: false }));
                    formikCredit.setFieldValue("entryId", "");
                    setMemberId((oldData) => ({ ...oldData, C: "" }));
                  }}
                >
                  <ClearSharp
                    fontSize="small"
                    sx={{ color: "#fff", fontSize: "10px" }}
                  />
                </IconButton>
                <div
                  style={{
                    width: "100%",
                  }}
                  className={`flex ${MainStyle.subWriteBox}`}
                >
                  <div className={MainStyle.abAmtBox}>
                    <WriteDivField
                      customClass={MainStyle.writeInput}
                      handleInput={(e) => {
                        handelAmtInput(e, formikCredit);
                      }}
                      placeholder={"રકમ"}
                      // handleBlur={handleBlur}
                    />
                  </div>
                </div>
              </div>
            )}
            {!isAmtBoxOpen.C && (
              <div
                className={
                  isCreditWriting
                    ? MainStyle.isCreditWriteBox
                    : MainStyle.writeBox
                }
              >
                {isCreditWriting && (
                  <div className="flex">
                    <IconButton
                      size="small"
                      className={MainStyle.closeBtn}
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
                  className={`flex ${
                    isCreditWriting ? MainStyle.subWriteBox : ""
                  }`}
                  onClick={() => setIsCreditWriting(true)}
                >
                  <div className={MainStyle.nameBox}>
                    <WriteDivField
                      customClass={MainStyle.writeInput}
                      style={{
                        backgroundColor: isCreditWriting ? "#E3FFC7" : "white",
                      }}
                      handleInput={handleCreditInput}
                      placeholder={"નામ"}
                    />
                  </div>

                  <div className={MainStyle.amtBox}>
                    <WriteDivField
                      customClass={MainStyle.writeInput}
                      style={{
                        backgroundColor: isCreditWriting ? "#E3FFC7" : "white",
                      }}
                      handleInput={(e) => {
                        handelAmtInput(e, formikCredit);
                      }}
                      placeholder={"રકમ"}
                    />
                  </div>
                </div>
                <div
                  className="w-100 flex flexBetween"
                  style={{
                    marginTop: "1px",
                    backgroundColor: isCreditWriting ? "#E3FFC7" : "white",
                  }}
                >
                  <div
                    onClick={() => handleSetEtype(formikCredit, "R")}
                    className="flexCenter"
                    style={{
                      backgroundColor:
                        formikCredit.values.etype === "R"
                          ? "greenyellow"
                          : "inherit",
                      width: "33.33%",
                    }}
                  >
                    નેટ
                  </div>
                  <div
                    onClick={() => handleSetEtype(formikCredit, "P")}
                    className="flexCenter"
                    style={{
                      backgroundColor:
                        formikCredit.values.etype === "P"
                          ? "greenyellow"
                          : "inherit",
                      width: "33.33%",
                      borderRight: "1px solid gray",
                      borderLeft: "1px solid gray",
                    }}
                  >
                    ચુકતે
                  </div>
                  <div
                    onClick={() => handleSetEtype(formikCredit, "MR")}
                    className="flexCenter"
                    style={{
                      backgroundColor:
                        formikCredit.values.etype === "MR"
                          ? "greenyellow"
                          : "inherit",
                      width: "33.33%",
                    }}
                  >
                    રજા
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: isCreditWriting ? "4rem" : "3.1rem",
                    backgroundColor: isCreditWriting ? "#E3FFC7" : "white",
                    borderTop: "1px solid #00000040",
                  }}
                >
                  <WriteDivField
                    customClass={""}
                    style={{
                      height: "95%",
                      width: "100%",
                      marginTop: ".1rem",
                      backgroundColor: "inherit",
                    }}
                    handleInput={handleCreditByWhom}
                    placeholder={"હસ્તે"}
                  />
                </div>
              </div>
            )}

            {isCreditWriting && (
              <div className={MainStyle.creditSelectBox}>
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
                                ? MainStyle.creditSelectedEntOption
                                : MainStyle.creditEntOption
                            }
                            onClick={() => {
                              setForceAdd((old) => ({ ...old, C: false }));
                              formikCredit.setValues({
                                ...formikCredit.values,
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
            {/* {selectMemberHtml("C", formikCredit)} */}
          </div>
        )}

        {/* --------------------------------------------- Debit Box ---------------------------------------- */}
        {openAutoSubmit[1] ? (
          <div className={MainStyle.creditBox}>
            <label className={`${MainStyle.inputLabel} gradient-text`}>
              ઉઘાર :
            </label>
            <div className={MainStyle.autoSumitBox}>
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
          <div className={MainStyle.debitBox}>
            <label className={`${MainStyle.inputLabel} gradient-text`}>
              ઉઘાર :
            </label>

            {isAmtBoxOpen.D && (
              <div>
                <IconButton
                  size="small"
                  className={MainStyle.closeBtn}
                  onClick={() => {
                    setIsAmtBoxOpen((oldData) => ({ ...oldData, D: false }));
                    formikDebit.setFieldValue("entryId", "");
                    setMemberId((oldData) => ({ ...oldData, D: "" }));
                  }}
                >
                  <ClearSharp
                    fontSize="small"
                    sx={{ color: "#fff", fontSize: "10px" }}
                  />
                </IconButton>
                <div
                  style={{
                    width: "100%",
                  }}
                  className={`flex ${MainStyle.subWriteBox}`}
                >
                  <div className={MainStyle.abAmtBox}>
                    <WriteDivField
                      customClass={MainStyle.writeInput}
                      handleInput={(e) => {
                        handelAmtInput(e, formikDebit);
                      }}
                      placeholder={"રકમ"}

                      // handleBlur={handleBlur}
                    />
                  </div>
                </div>
              </div>
            )}
            {!isAmtBoxOpen.D && (
              <div
                className={
                  isDebitWriting
                    ? MainStyle.isDebitWriteBox
                    : MainStyle.writeBox
                }
              >
                {isDebitWriting && (
                  <div className="flex gap-05">
                    <IconButton
                      size="small"
                      className={MainStyle.closeBtn}
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
                  className={`flex ${
                    isDebitWriting ? MainStyle.subWriteBox : ""
                  }`}
                  onClick={() => setIsDebitWriting(true)}
                >
                  <div className={MainStyle.nameBox}>
                    <WriteDivField
                      customClass={MainStyle.writeInput}
                      style={{
                        backgroundColor: isDebitWriting ? "#FBCECD" : "white",
                      }}
                      handleInput={handleDebitInput}
                      placeholder={"નામ"}
                      // handleBlur={handleBlur}
                    />
                  </div>

                  <div className={MainStyle.amtBox}>
                    <WriteDivField
                      customClass={MainStyle.writeInput}
                      style={{
                        backgroundColor: isDebitWriting ? "#FBCECD" : "white",
                      }}
                      handleInput={(e) => {
                        handelAmtInput(e, formikDebit);
                      }}
                      placeholder={"રકમ"}
                      // handleBlur={handleBlur}
                    />
                  </div>
                </div>
                <div
                  className="w-100 flex flexBetween"
                  style={{
                    marginTop: "1px",
                    backgroundColor: isDebitWriting ? "#FBCECD" : "white",
                  }}
                >
                  <div
                    onClick={() => handleSetEtype(formikDebit, "R")}
                    className="flexCenter"
                    style={{
                      backgroundColor:
                        formikDebit.values.etype === "R"
                          ? "palevioletred"
                          : "inherit",
                      width: "33.33%",
                    }}
                  >
                    નેટ
                  </div>
                  <div
                    onClick={() => handleSetEtype(formikDebit, "P")}
                    className="flexCenter"
                    style={{
                      backgroundColor:
                        formikDebit.values.etype === "P"
                          ? "palevioletred"
                          : "inherit",
                      width: "33.33%",
                      borderRight: "1px solid gray",
                      borderLeft: "1px solid gray",
                    }}
                  >
                    ચુકતે
                  </div>
                  <div
                    onClick={() => handleSetEtype(formikDebit, "MR")}
                    className="flexCenter"
                    style={{
                      backgroundColor:
                        formikDebit.values.etype === "MR"
                          ? "palevioletred"
                          : "inherit",
                      width: "33.33%",
                    }}
                  >
                    રજા
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: isCreditWriting ? "4rem" : "3.1rem",
                    backgroundColor: isDebitWriting ? "#FBCECD" : "white",
                    borderTop: "1px solid #00000040",
                  }}
                >
                  <WriteDivField
                    customClass={""}
                    style={{
                      height: "95%",
                      width: "100%",
                      marginTop: ".1rem",
                      backgroundColor: "inherit",
                    }}
                    handleInput={handleDebitByWhom}
                    placeholder={"હસ્તે"}
                  />
                </div>
              </div>
            )}

            {isDebitWriting && (
              <div className={MainStyle.debitSelectBox}>
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
                                ? MainStyle.creditSelectedEntOption
                                : MainStyle.creditEntOption
                            }
                            onClick={() => {
                              setForceAdd((old) => ({ ...old, D: false }));
                              formikDebit.setValues({
                                ...formikDebit.values,
                                entryId: item._id,
                                etype: item.type,
                              });
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
            {/* {selectMemberHtml("D", formikDebit)} */}
          </div>
        )}

        {/* --------------------------------------------- Temprory Uchank Box ---------------------------------------- */}

        {openAutoSubmit[2] ? (
          <div className={MainStyle.temBorrowBox}>
            <label className={`${MainStyle.inputLabel} gradient-text`}>
              ઉચક :
            </label>
            <div className={MainStyle.autoSumitBox}>
              <CircularProgress size={40} />
              <h4 style={{ textAlign: "center" }}>Submitting Please Wait..</h4>
              {!removeCancelBtn && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() =>
                    handelCancel(
                      [false, false, false],
                      setIsTempBorrowWriting,
                      formikTempBorrow
                    )
                  }
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className={MainStyle.temBorrowBox}>
            <label className={`${MainStyle.inputLabel} gradient-text`}>
              ઉચક :
            </label>
            <div
              className={
                isTempBorrowWriting
                  ? MainStyle.isTempBorrowWriteBox
                  : MainStyle.writeBox
              }
            >
              {isTempBorrowWriting && (
                <div className="flex">
                  <IconButton
                    size="small"
                    className={MainStyle.closeBtn}
                    onClick={() => setIsTempBorrowWriting(false)}
                  >
                    <ClearSharp
                      fontSize="small"
                      sx={{ color: "#fff", fontSize: "10px" }}
                    />
                  </IconButton>
                  <div
                    style={{ backgroundColor: "white", minWidth: "28.5rem" }}
                    className="flex"
                  >
                    <div style={{ minWidth: "20rem" }}>
                      <h5>{formikTempBorrow.values.entName}</h5>
                    </div>
                    <div style={{ minWidth: "3.3rem" }}>
                      <h5>{formikTempBorrow.values.amount}</h5>
                    </div>
                  </div>
                  {/* <div style={{ minWidth: "6.8rem" }}>
                    <h5>{formikTempBorrow.values.amount}</h5>
                  </div>
                  <div style={{ minWidth: "9.8rem" }}>
                    <h5>{formikTempBorrow.values.entName}</h5>
                  </div> */}
                </div>
              )}
              <div
                style={{
                  width: "100%",
                }}
                className={`flex ${
                  isTempBorrowWriting ? MainStyle.subWriteBox : ""
                }`}
                onClick={() => setIsTempBorrowWriting(true)}
              >
                <div className={MainStyle.nameBox}>
                  <div
                    className="flex"
                    style={{
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: "50%",
                        borderBottom: "1px solid #00000040",
                        borderRight: "1px solid #00000040",
                      }}
                    >
                      <WriteDivField
                        customClass={MainStyle.writeNameInput}
                        handleInput={(e) => handleTempBorrowInput(e, "entName")}
                        placeholder={"નામ"}
                        style={
                          isTempBorrowWriting
                            ? {
                                height: "4.6rem",
                                width: "100%",
                              }
                            : { height: "4.6rem", width: "100%" }
                        }
                      />
                    </div>

                    <div
                      style={{
                        width: "50%",
                      }}
                    >
                      <WriteDivField
                        customClass={MainStyle.writeAreaInput}
                        handleInput={(e) => handleTempBorrowInput(e, "entArea")}
                        placeholder={"સીટી"}
                        style={
                          isTempBorrowWriting
                            ? {
                                height: "2.1rem",
                                borderBottom: "none",
                              }
                            : {
                                height: "2.1rem",
                                backgroundColor: "white",
                                borderBottom: "none",
                              }
                        }
                      />
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label" size="small">
                          Select City
                        </InputLabel>

                        <Select
                          sx={{
                            background: "#fff",
                            borderRadius: "none",
                            // height: "1.5rem",
                          }}
                          size="small"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={
                            cities.includes(formikTempBorrow.values.entArea)
                              ? formikTempBorrow.values.entArea
                              : ""
                          }
                          label={"Select City"}
                          onChange={(e) =>
                            formikTempBorrow.setFieldValue(
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
                    customClass={MainStyle.writePhoneInput}
                    handleInput={(e) => handelPhoneInput(e)}
                    placeholder={"ફોન નંબર"}
                    style={
                      isTempBorrowWriting
                        ? null
                        : {
                            height: "4.9rem",
                          }
                    }
                    placeholderRight={formikTempBorrow.values.entPhone?.length}
                  />
                </div>

                <div className={MainStyle.amtBox}>
                  <WriteDivField
                    customClass={MainStyle.writeAmtInput}
                    handleInput={(e) => {
                      handelAmtInput(e, formikTempBorrow);
                    }}
                    placeholder={isTempBorrowWriting ? "Amount" : ""}
                    style={
                      isTempBorrowWriting
                        ? {
                            height: "8rem",
                          }
                        : {
                            height: "9.5rem",
                          }
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
