import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addEntity, updateEntity } from "../../apis/entitySlice.js";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  calculatePercentageAmount,
  phoneConvertGujaratiToEnglish,
} from "../../common/common.js";
import WriteDivField from "../../components/WriteDivField.js";
import DailogStyle from "./DailogStyle.module.scss";
import { useState } from "react";
import { Typography } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const validationSchema = yup.object({
  name: yup.string("Enter supplier name").required("Name is required"),
  amount: yup
    .number("Enter amount")
    .required("Amount is required")
    .test(
      "not-zero",
      "Amount cannot be zero",
      (value) => value && !/^[0]+$/.test(value)
    ),
  note: yup.string("Enter note"),
});

export default function BankDialog(props) {
  const { openBankDialog, setOpenBankDialog, setBanks } = props;
  const dispatch = useDispatch();
  const { entLoading } = useSelector((state) => state.entData);
  const { loggedIn } = useSelector((state) => state.authData);

  const [oldValues, setOldValues] = useState({
    name: "",
    amount: "",
    note: "",
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      amount: "",
      note: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const cutOffPercentage = loggedIn?.cutOff || null;
      const finalData = {
        ...values,
        uId: loggedIn?._id,
        type: "B",
        name:
          values?.name?.includes("બેન્ક") || values?.name?.includes("બેંક")
            ? values?.name
            : `${values?.name} બેન્ક`,
        amount: cutOffPercentage
          ? calculatePercentageAmount(values?.amount, cutOffPercentage)
          : values?.amount,
        reference: cutOffPercentage
          ? calculatePercentageAmount(values?.amount, cutOffPercentage)
          : values?.amount,
      };
      const response = await dispatch(
        openBankDialog[1] ? updateEntity(finalData) : addEntity(finalData)
      );
      if (!response.payload.error) {
        toast.success(response.payload?.message);
        setOpenBankDialog([false, null]);
        resetForm();
      }
      setOldValues({
        name: "",
        amount: "",
        note: "",
      });
    },
  });

  useEffect(() => {
    if (openBankDialog[1]) {
      setOldValues(openBankDialog[1]);
      formik.setValues(openBankDialog[1]);
    }
  }, [openBankDialog]);

  const handleCancel = () => {
    setOpenBankDialog([false, null, null]);
    formik.resetForm();
    setOldValues({
      name: "",
      amount: "",
      note: "",
    });
    // setIsAddNew(false);
  };

  const handleTextInput = (event, name) => {
    const value = event.target.textContent;
    formik.setFieldValue(name, value);
  };

  const handleNumberInput = (event, name) => {
    const value = event.target.textContent;
    const translatedValue = phoneConvertGujaratiToEnglish(value);
    const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
    if (isNumeric) {
      formik.setFieldValue(name, translatedValue);
    }
  };

  const handleBlur = (fieldName) => {
    formik.handleBlur({
      target: { name: fieldName },
    });
  };

  const fields = [
    {
      name: "name",
      placeholder: "નામ",
      handler: handleTextInput,
      type: "text",
    },

    {
      name: "amount",
      placeholder: "રકમ",
      handler: handleNumberInput,
      type: "number",
    },
    {
      name: "note",
      placeholder: "નોટ",
      handler: handleTextInput,
      type: "text",
    },
  ];

  return (
    <React.Fragment>
      <Dialog
        open={openBankDialog[0]}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle className="modalHeader">
          <h3>{openBankDialog[1] ? "Update" : "Add"} Bank</h3>
        </DialogTitle>
        <DialogContent className="modalContent">
          <form onSubmit={formik.handleSubmit}>
            {fields.map((field) =>
              entLoading ? (
                <div
                  key={field.name}
                  className={`inputBox ${DailogStyle.wrtieDiv}`}
                >
                  Loading...
                </div>
              ) : (
                <div className="inputBox" key={field.name}>
                  {oldValues && oldValues[field?.name] && (
                    <Typography
                      fontWeight={550}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {oldValues[field?.name]}
                    </Typography>
                  )}
                  <div
                    style={{ width: "100%" }}
                    className={
                      formik.touched[field.name] && formik.errors[field.name]
                        ? DailogStyle.wrtieBoxError
                        : DailogStyle.wrtieBox
                    }
                  >
                    <WriteDivField
                      style={{ width: "100%" }}
                      customClass={DailogStyle.wrtieDiv}
                      handleInput={(e) => field.handler(e, field.name)}
                      handleBlur={() => handleBlur(field.name)}
                      placeholder={field.placeholder}
                    />
                  </div>
                  {formik.touched[field.name] && formik.errors[field.name] && (
                    <div className={DailogStyle.errorText}>
                      {formik.errors[field.name]}
                    </div>
                  )}
                </div>
              )
            )}
            {/* <div className="inputBox">
              <TextField
                size="small"
                fullWidth
                // className={ProblemStyle.input}
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </div>

            <div className="inputBox">
              <TextField
                size="small"
                type="number"
                label="Amount"
                fullWidth
                // className={ProblemStyle.input}
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </div>

            <div className="inputBox">
              <TextField
                size="small"
                label="Note"
                fullWidth
                // className={ProblemStyle.input}
                name="note"
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.note && Boolean(formik.errors.note)}
                helperText={formik.touched.note && formik.errors.note}
              />
            </div> */}
            <DialogActions className="modalFooter">
              <Button
                variant="contained"
                onClick={handleCancel}
                className="cancelBtn"
              >
                Cancel
              </Button>
              <LoadingButton
                loading={entLoading}
                variant="contained"
                type="submit"
                className="submitBtn"
                endIcon={<span />}
              >
                Submit
              </LoadingButton>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
