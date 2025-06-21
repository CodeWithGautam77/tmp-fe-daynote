import { toast } from "react-toastify";
import WriteDivField from "../../components/WriteDivField";
import Style from "./WriteSilakEntry.module.scss";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import * as yup from "yup";
import { phoneConvertGujaratiToEnglish } from "../../common/common";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useState } from "react";
import { addDailyCashTotal, addRetailEntry } from "../../apis/retailSlice";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { ClearSharp } from "@mui/icons-material";

export default function WriteSilakEntry() {
  const dispatch = useDispatch();

  const [openAutoSubmit, setOpenAutoSubmit] = useState(false);
  const [isCashWriting, setIsCashWriting] = useState(false);

  const { loggedIn } = useSelector((state) => state.authData);
  const currentDate = useSelector((state) => state.date.currentDate);

  const ValidationSchema = yup.object({
    entName: yup.string().required("Please enter entName"),
  });

  const formikSilak = useFormik({
    initialValues: {
      entName: "",
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      // console.log("formikSilak Values-->", {
      //   ...values,
      //   uId: loggedIn._id,
      //   date: moment(currentDate)?.format("YYYY-MM-DD"),
      // });

      const response = await dispatch(
        addDailyCashTotal({
          ...values,
          uId: loggedIn._id,
          date: moment(currentDate)?.format("YYYY-MM-DD"),
        })
      );
      if (!response.payload.error) {
        resetForm();
        toast.success(response.payload.message);
      } else {
        resetForm();
        toast.error(response.payload.message);
      }
      setOpenAutoSubmit(false);
      setIsCashWriting(false);
    },
  });

  const handelCashInput = (event) => {
    const value = event.target.textContent;
    if (value) {
      const translatedValue = phoneConvertGujaratiToEnglish(value);
      const isNumeric = /^\d+(\.\d+)?$/.test(`${translatedValue}`);
      if (isNumeric) {
        formikSilak.setFieldValue("entName", `${translatedValue}`);
      }
    } else {
      formikSilak.setFieldValue("entName", "");
    }
  };

  useEffect(() => {
    if (formikSilak.isValid && formikSilak.dirty) {
      const outerTimeout = setTimeout(() => {
        setOpenAutoSubmit(true);
        const innerTimeout = setTimeout(() => {
          formikSilak.submitForm();
          // setOpenAutoSubmit(false);
        }, 2000); // 5 seconds

        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds

      return () => clearTimeout(outerTimeout);
    }
  }, [formikSilak.values, formikSilak.isValid]);

  return (
    <div className={Style.mainBox}>
      {openAutoSubmit ? (
        <div className={Style.autoSumitBox}>
          <CircularProgress size={50} />
          <h3>Submitting Please Wait ..</h3>
        </div>
      ) : (
        <>
          {!isCashWriting && (
            <Button className="btnRed" onClick={() => setIsCashWriting(true)}>
              સિલક
            </Button>
          )}

          {isCashWriting && (
            <div className={isCashWriting ? Style.isCashWriteBox : ""}>
              {isCashWriting && (
                <IconButton
                  size="small"
                  className={Style.closeBtn}
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
              >
                <WriteDivField
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    height: isCashWriting ? "3.5rem" : "0rem",
                    borderRadius: ".3rem",
                  }}
                  handleInput={handelCashInput}
                  placeholder={"સિલક"}
                />
              </div>
            </div>
          )}
          {/* {!isCashWriting &&
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
      ) : null} */}
        </>
      )}
    </div>
  );
}
