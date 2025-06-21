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
import { addRetailEntry } from "../../apis/retailSlice";
import { Button, CircularProgress } from "@mui/material";

export default function WrtiteRetailEntry(props) {
  const {
    openAutoSubmit,
    setOpenAutoSubmit,
    firstCancelFunc,
    setSecondCancelFunc,
  } = props;
  const dispatch = useDispatch();

  // const [openAutoSubmit, setOpenAutoSubmit] = useState([false, false]);
  const [selectedType, setSelectedType] = useState("");

  const { loggedIn } = useSelector((state) => state.authData);
  const currentDate = useSelector((state) => state.date.currentDate);

  const incomeValidationSchema = yup.object({
    amount: yup.string().required("Please enter amount"),
    type: yup.string().required("Please enter type"),
    // iType: yup.string().required("Please enter itype"),
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
      setOpenAutoSubmit([false, false]);
      // console.log("formikIncome Values-->", {
      //   ...values,
      //   uId: loggedIn._id,
      //   date: moment(currentDate)?.format("YYYY-MM-DD"),
      // });

      const response = await dispatch(
        addRetailEntry({
          ...values,
          uId: loggedIn._id,
          date: moment(currentDate)?.format("YYYY-MM-DD"),
        })
      );
      if (!response.payload.error) {
        resetForm();
        setSelectedType("");
        toast.success(response.payload.message);
      } else {
        resetForm();
        setSelectedType("");
        toast.error(response.payload.message);
      }
    },
  });

  const handelIncomeAmtInput = (event, formik, type) => {
    const value = event.target.textContent;
    const translatedValue = phoneConvertGujaratiToEnglish(value);
    const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
    if (isNumeric) {
      // formik.setFieldValue("amount", translatedValue);
      // formik.setFieldValue("type", type);
      // formik.setFieldValue("iType", "I");
      formik.setValues({
        ...formik.values,
        amount: translatedValue,
        type: type,
        iType: "I",
      });
    }
  };

  const handelExpenseAmtInput = (event, formik) => {
    const value = event.target.textContent;
    const translatedValue = phoneConvertGujaratiToEnglish(value);
    const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
    if (isNumeric) {
      // formik.setFieldValue("amount", translatedValue);
      // formik.setFieldValue("iType", "E");
      formik.setValues({
        ...formik.values,
        amount: translatedValue,
        iType: "E",
      });
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
    if (firstCancelFunc) {
      firstCancelFunc();
    }
  };
  useEffect(() => {
    setSecondCancelFunc(() => handelCancel);
  }, []);
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
    // formikIncome.setFieldValue("type", type); // Set the value in formikIncome
    // formikIncome.setFieldValue("amount", amount); // Set the value in formikIncome
    // formikIncome.setFieldValue("iType", "I"); // Set the value in formikIncome
    formikIncome.setValues({
      ...formikIncome.values,
      amount: amount,
      type: type,
      iType: "I",
    });

    const outerTimeout = setTimeout(() => {
      setOpenAutoSubmit([true, false]);
      const innerTimeout = setTimeout(() => {
        formikIncome.submitForm();
        setOpenAutoSubmit([false, false]);
      }, 500);

      return () => clearTimeout(innerTimeout);
    }, 100);

    return () => clearTimeout(outerTimeout);
  };

  return (
    <div className={WrtiteRetailEntryStyle.mainWriteBox}>
      <div className={WrtiteRetailEntryStyle.incodeAmountBoxGrp}>
        {openAutoSubmit[0] || openAutoSubmit[1] ? (
          <></>
        ) : (
          // <div className={WrtiteRetailEntryStyle.autoSumitBox}>
          //   <CircularProgress size={30} />
          //   <h3>Submitting Please Wait ..</h3>
          //   <Button
          //     variant="contained"
          //     color="error"
          //     size="small"
          //     onClick={handelCancel}
          //   >
          //     Cancel
          //   </Button>
          // </div>
          <>
            <div className={WrtiteRetailEntryStyle.amountBox}>
              <div style={{ width: "49%" }}>
                <WriteDivField
                  handleInput={(e) =>
                    handelIncomeAmtInput(e, formikIncome, "C")
                  }
                  customClass={WrtiteRetailEntryStyle.incomeAmountTextBox}
                  placeholder="Cash Amount"
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ width: "49%" }}>
                <WriteDivField
                  handleInput={(e) =>
                    handelIncomeAmtInput(e, formikIncome, "O")
                  }
                  customClass={WrtiteRetailEntryStyle.incomeAmountTextBox}
                  placeholder="Online Amount"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className={WrtiteRetailEntryStyle.amountBox}>
              <div className={WrtiteRetailEntryStyle.frequentlyNumBox}>
                {fNumberHTML("C")}
              </div>
              <div className={WrtiteRetailEntryStyle.frequentlyNumBox}>
                {fNumberHTML("O")}
              </div>
            </div>
            {/* <div className={WrtiteRetailEntryStyle.amountBox}>
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
            </div> */}
          </>
        )}
      </div>
      <div className={WrtiteRetailEntryStyle.expenseAmountBoxGrp}>
        <div className="flexBetween">
          {!openAutoSubmit[1] && !openAutoSubmit[0] && (
            <div className={WrtiteRetailEntryStyle.buttonContainer}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedType === "C"}
                  onChange={() => handleTypeSelection("C")}
                  disabled={formikIncome?.values?.iType === "I"}
                />
                Cash
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={selectedType === "O"}
                  onChange={() => handleTypeSelection("O")}
                  disabled={formikIncome?.values?.iType === "I"}
                />
                Online
              </label>
            </div>
          )}
        </div>

        {openAutoSubmit[1] || openAutoSubmit[0] ? (
          <></>
        ) : (
          // <div className={WrtiteRetailEntryStyle.autoSumitBox}>
          //   <CircularProgress size={30} />
          //   <h3>Submitting Please Wait ..</h3>
          //   <Button
          //     variant="contained"
          //     color="error"
          //     size="small"
          //     onClick={handelCancel}
          //   >
          //     Cancel
          //   </Button>
          // </div>
          <>
            <div className="flexCenter gap-05">
              <div style={{ width: "40%" }}>
                <WriteDivField
                  handleInput={(e) =>
                    handelExpenseAmtInput(e, formikIncome, "E")
                  }
                  customClass={WrtiteRetailEntryStyle.amountTextBox}
                  placeholder="રકમ"
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ width: "60%" }}>
                <WriteDivField
                  handleInput={handleTextnput}
                  customClass={WrtiteRetailEntryStyle.textBox}
                  placeholder="નામ"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
