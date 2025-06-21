import { toast } from "react-toastify";
import WriteDivField from "../../components/WriteDivField";
import WrtiteRetailEntryStyle from "./WrtiteRetailEntry.module.scss";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import * as yup from "yup";
import { phoneConvertGujaratiToEnglish } from "../../common/common";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useState } from "react";
import { updateRetailEntry } from "../../apis/retailSlice";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { ClearSharp } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";

export default function UpdateRetailEntry(props) {
  const { oldData, setOldData, handeDelete } = props;
  const dispatch = useDispatch();

  const [openAutoSubmit, setOpenAutoSubmit] = useState([false, false]);
  const [selectedType, setSelectedType] = useState("");

  const { loggedIn } = useSelector((state) => state.authData);
  const currentDate = useSelector((state) => state.date.currentDate);

  const incomeValidationSchema = yup.object({
    amount: yup.string().required("Please enter amount"),
  });

  const formikIncome = useFormik({
    initialValues: {
      date: "",
      amount: "",
      type: "",
      iType: "",
      text: "",
    },
    validationSchema: incomeValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      // console.log("formikIncome Values-->", {
      //   ...values,
      //   uId: loggedIn._id,
      //   date: moment(currentDate)?.format("YYYY-MM-DD"),
      // });

      const response = await dispatch(
        updateRetailEntry({
          ...values,
          uId: loggedIn._id,
          date: moment(currentDate)?.format("YYYY-MM-DD"),
          id: oldData?._id,
        })
      );
      if (!response.payload.error) {
        resetForm();
        setSelectedType("");
        toast.success(response.payload.message);
        setOpenAutoSubmit([false, false]);
        setOldData([false, null]);
      } else {
        resetForm();
        setSelectedType("");
        toast.error(response.payload.message);
        setOpenAutoSubmit([false, false]);
        setOldData([false, null]);
      }
    },
  });

  const handelIncomeAmtInput = (event, formik, type, iType) => {
    const value = event.target.textContent;
    const translatedValue = phoneConvertGujaratiToEnglish(value);
    const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
    if (isNumeric) {
      formik.setFieldValue("amount", translatedValue);
      formik.setFieldValue("type", type);
      formik.setFieldValue("iType", iType);
    }
  };

  const handelExpenseAmtInput = (event, formik, iType) => {
    const value = event.target.textContent;
    const translatedValue = phoneConvertGujaratiToEnglish(value);
    const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
    if (isNumeric) {
      formik.setFieldValue("amount", translatedValue);
      formik.setFieldValue("iType", iType);
    }
  };

  const handleTextnput = (event) => {
    const value = event.target.textContent;
    formikIncome.setFieldValue("text", value);
  };

  useEffect(() => {
    if (formikIncome.isValid && formikIncome.dirty) {
      const outerTimeout = setTimeout(() => {
        if (formikIncome.values.iType === "I") {
          setOpenAutoSubmit([true, false]);
        }
        if (formikIncome.values.iType === "E") {
          setOpenAutoSubmit([false, true]);
        }
        const innerTimeout = setTimeout(() => {
          formikIncome.submitForm();
          setOpenAutoSubmit([false, false]);
        }, 2000); // 5 seconds

        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds

      return () => clearTimeout(outerTimeout);
    }
  }, [formikIncome.values, formikIncome.isValid]);

  const handelCancel = () => {
    setOpenAutoSubmit([false, false]);
    formikIncome.resetForm();
    setSelectedType("");
  };

  const handleTypeSelection = (type) => {
    setSelectedType(type); // Update the selected type
    formikIncome.setFieldValue("type", type); // Set the value in formikIncome
  };

  const fNumberHTML = (type) => {
    return (
      <>
        {loggedIn && loggedIn?.fNumbers?.length > 0 && (
          <div className="flexAround">
            {loggedIn?.fNumbers?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={WrtiteRetailEntryStyle.frequentlyNumber}
                  onClick={() => handelfrequentlyNumberClick(item, type)}
                >
                  {item}
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  };

  const handelfrequentlyNumberClick = (amount, type) => {
    formikIncome.setFieldValue("type", type); // Set the value in formikIncome
    formikIncome.setFieldValue("amount", amount); // Set the value in formikIncome
    formikIncome.setFieldValue("iType", "I"); // Set the value in formikIncome
    const outerTimeout = setTimeout(() => {
      setOpenAutoSubmit([true, false]);
      const innerTimeout = setTimeout(() => {
        formikIncome.submitForm();
        setOpenAutoSubmit([false, false]);
      }, 2000); // 5 seconds

      return () => clearTimeout(innerTimeout);
    }, 1000); // 5 seconds

    return () => clearTimeout(outerTimeout);
  };
  const types = {
    C: "Cash",
    O: "Online",
    K: "Card",
  };
  return (
    <div className={WrtiteRetailEntryStyle.mainWriteBox}>
      {oldData.iType === "I" && (
        <div className={WrtiteRetailEntryStyle.incomeBox}>
          <div className={WrtiteRetailEntryStyle.incodeAmountBoxGrp}>
            <div className={WrtiteRetailEntryStyle.updateHeader}>
              <IconButton
                size="small"
                className={WrtiteRetailEntryStyle.closeBtn}
                onClick={() => {
                  setOldData([false, null]);
                }}
              >
                <ClearSharp
                  fontSize="small"
                  sx={{ color: "#fff", fontSize: "10px" }}
                />
              </IconButton>
              <label
                className={`${WrtiteRetailEntryStyle.inputLabel} gradient-text`}
              >
                આવક : {oldData?.amount}
              </label>
              <div
                className={WrtiteRetailEntryStyle.deletIcon}
                onClick={() => handeDelete(oldData)}
              >
                <Delete
                  sx={{
                    color: oldData.amount ? "red" : "lightgray",
                  }}
                  fontSize="small"
                />
              </div>
            </div>

            {openAutoSubmit[0] ? (
              <div className={WrtiteRetailEntryStyle.autoSumitBox}>
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
            ) : (
              <>
                {oldData?.type === "C" && (
                  <div className={WrtiteRetailEntryStyle.amountBox}>
                    <WriteDivField
                      handleInput={(e) =>
                        handelIncomeAmtInput(e, formikIncome, "C", "I")
                      }
                      customClass={WrtiteRetailEntryStyle.incomeAmountTextBox}
                      placeholder="Cash Amount"
                      style={{ width: "100%" }}
                    />
                    <div className={WrtiteRetailEntryStyle.frequentlyNumBox}>
                      {fNumberHTML("C")}
                    </div>
                  </div>
                )}
                {oldData?.type === "O" && (
                  <div className={WrtiteRetailEntryStyle.amountBox}>
                    <WriteDivField
                      handleInput={(e) =>
                        handelIncomeAmtInput(e, formikIncome, "O", "I")
                      }
                      customClass={WrtiteRetailEntryStyle.incomeAmountTextBox}
                      placeholder="Online Amount"
                      style={{ width: "100%" }}
                    />
                    <div className={WrtiteRetailEntryStyle.frequentlyNumBox}>
                      {fNumberHTML("O")}
                    </div>
                  </div>
                )}
                {oldData?.type === "K" && (
                  <div className={WrtiteRetailEntryStyle.amountBox}>
                    <WriteDivField
                      handleInput={(e) =>
                        handelIncomeAmtInput(e, formikIncome, "K", "I")
                      }
                      customClass={WrtiteRetailEntryStyle.incomeAmountTextBox}
                      placeholder="Card Amount"
                      style={{ width: "100%" }}
                    />
                    <div className={WrtiteRetailEntryStyle.frequentlyNumBox}>
                      {fNumberHTML("K")}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {oldData.iType === "E" && (
        <div className={WrtiteRetailEntryStyle.expenseBox}>
          <div
            className={WrtiteRetailEntryStyle.expenseAmountBoxGrp}
            style={{ gap: "1rem" }}
          >
            <div className={WrtiteRetailEntryStyle.updateHeader}>
              <IconButton
                size="small"
                className={WrtiteRetailEntryStyle.closeBtn}
                onClick={() => {
                  setOldData([false, null]);
                }}
              >
                <ClearSharp
                  fontSize="small"
                  sx={{ color: "#fff", fontSize: "10px" }}
                />
              </IconButton>
              <label
                className={`${WrtiteRetailEntryStyle.inputLabel} gradient-text`}
              >
                જાવક : {oldData?.amount} {oldData?.text} {types[oldData?.type]}
              </label>
              <div
                className={WrtiteRetailEntryStyle.deletIcon}
                onClick={() => handeDelete(oldData)}
              >
                <Delete
                  sx={{
                    color: oldData.amount ? "red" : "lightgray",
                  }}
                  fontSize="small"
                />
              </div>
            </div>
            {openAutoSubmit[1] ? (
              <div className={WrtiteRetailEntryStyle.autoSumitBox}>
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
            ) : (
              <>
                <div>
                  <WriteDivField
                    handleInput={(e) =>
                      handelExpenseAmtInput(e, formikIncome, "E")
                    }
                    customClass={WrtiteRetailEntryStyle.amountTextBox}
                    placeholder="રકમ"
                    style={{ width: "100%" }}
                  />
                </div>
                {/* <WriteDivField
              handleInput={handleTextnput}
              customClass={WrtiteRetailEntryStyle.textBox}
              placeholder="નામ"
            /> */}
                <WriteDivField
                  handleInput={handleTextnput}
                  customClass={WrtiteRetailEntryStyle.textBox}
                  placeholder="નામ"
                  style={{ width: "100%" }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
