import { useFormik } from "formik";
import WriteDivField from "../../components/WriteDivField";
import Style from "./WriteTempLongtermLedger.module.scss";
import * as yup from "yup";
import {
  calculatePercentageAmount,
  phoneConvertGujaratiToEnglish,
} from "../../common/common";
import { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addTempLongtermLedgerEntry } from "../../apis/tempLongtermLedger";
import { toast } from "react-toastify";
import { updateTempBorrow } from "../../apis/mainSlice";
import { updatelongtermBorrow } from "../../apis/longtermBorrowSlice";

export default function WriteTempLongtermLedger(props) {
  const { data, setOldValues } = props;
  const ValidationSchema = yup.object({
    amount: yup
      .string()
      .required("Please enter amount")
      .test(
        "not-zero",
        "Amount cannot be zero",
        (value) => value && !/^[0]+$/.test(value)
      ),
    note: yup.string(),
  });

  const dispatch = useDispatch();
  const { loggedIn } = useSelector((state) => state.authData);

  const [openAutoSubmit, setOpenAutoSubmit] = useState(false);
  const [note, setNote] = useState("");

  const formik = useFormik({
    initialValues: {
      accType: "",
      amount: "",
      note: "",
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setOpenAutoSubmit(false);
      const cutOffPercentage = loggedIn?.cutOff || null;

      const finalData = {
        ...values,
        uId: loggedIn._id,
        dataId: data._id,
        type: data?.type,
        amount: cutOffPercentage
          ? calculatePercentageAmount(values?.amount, cutOffPercentage)
          : values?.amount,
        isOpen: false,
      };
      const response = await dispatch(addTempLongtermLedgerEntry(finalData));
      if (!response.payload?.error) {
        const { updatedData } = response.payload.data;
        setOldValues((prev) => ({ ...prev, amount: updatedData.amount }));
        if (data?.type === "T") {
          dispatch(updateTempBorrow(updatedData));
        }
        if (data?.type === "L") {
          dispatch(updatelongtermBorrow(updatedData));
        }
        toast.success(response.payload?.message);
        resetForm();
      }
    },
  });

  const handleNumberInput = (event, type) => {
    const value = event.target.textContent;
    const translatedValue = phoneConvertGujaratiToEnglish(value);

    const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
    if (isNumeric) {
      formik.setValues({
        ...formik.values,
        amount: translatedValue,
        accType: type,
      });
    }
  };

  const handleNote = (event) => {
    const value = event.target.textContent;
    formik.setFieldValue("note", value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setNote(formik.values.note);
    }, 500); // Adjust debounce time as needed

    return () => clearTimeout(handler); // Cleanup previous timeout
  }, [formik.values.note]);

  useEffect(() => {
    if (formik.isValid && formik.dirty && formik.values.note === note) {
      const outerTimeout = setTimeout(() => {
        setOpenAutoSubmit(true);
        const innerTimeout = setTimeout(() => {
          formik.submitForm();
        }, 2000); // 5 seconds

        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds

      return () => clearTimeout(outerTimeout);
    }
  }, [formik.values, formik.isValid, note]);

  return (
    <>
      {openAutoSubmit ? (
        <div className={Style.autoSumitBox}>
          <CircularProgress size={50} />
          <h3>Submitting Please Wait ..</h3>
          {/* {!removeCancelBtn && ( */}
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => {
              formik.resetForm();
              setOpenAutoSubmit(false);
            }}
          >
            Cancel
          </Button>
          {/* )} */}
        </div>
      ) : (
        <div className={`inputBox ${Style.mainWriteBox}`}>
          <div className={Style.creditBox}>
            <div className={Style.writeBox}>
              <WriteDivField
                style={{ width: "100%", backgroundColor: "#e3ffc7" }}
                customClass={Style.wrtieDiv}
                handleInput={handleNote}
                placeholder={"વિગત"}
              />
            </div>
            <div className={Style.writeBox}>
              <WriteDivField
                style={{ width: "100%", backgroundColor: "#e3ffc7" }}
                customClass={Style.wrtieDiv}
                handleInput={(e) => handleNumberInput(e, "C")}
                placeholder={"રકમ"}
              />
            </div>
          </div>
          <div className={Style.debitBox}>
            <div className={Style.writeBox}>
              <WriteDivField
                style={{ width: "100%", backgroundColor: "#fbcecd" }}
                customClass={Style.wrtieDiv}
                handleInput={handleNote}
                placeholder={"વિગત"}
              />
            </div>
            <div className={Style.writeBox}>
              <WriteDivField
                style={{ width: "100%", backgroundColor: "#fbcecd" }}
                customClass={Style.wrtieDiv}
                handleInput={(e) => handleNumberInput(e, "D")}
                placeholder={"રકમ"}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
