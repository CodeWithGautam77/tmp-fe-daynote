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
  removeEnglishWords,
} from "../../common/common.js";
import DailogStyle from "./DailogStyle.module.scss";
import WriteDivField from "../../components/WriteDivField.js";
import Typography from "@mui/material/Typography";
import { useState } from "react";

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

export default function AngadiyaDialog(props) {
  const { openAngadiyaDialog, setOpenAngadiyaDialog } = props;
  const dispatch = useDispatch();
  const { entLoading } = useSelector((state) => state.entData);
  const { loggedIn } = useSelector((state) => state.authData);
  const currentDate = useSelector((state) => state.date.currentDate);

  const [oldValues, setOldValues] = useState(null); // Added oldValues state

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
        type: "A",
        name:
          values.name.includes("આંગડીયા") || values.name.includes("આંગડિયા")
            ? values.name
            : `${values.name} આંગડીયા`,
        amount: cutOffPercentage
          ? calculatePercentageAmount(values?.amount, cutOffPercentage)
          : values?.amount,
        reference: cutOffPercentage
          ? calculatePercentageAmount(values?.amount, cutOffPercentage)
          : values?.amount,
      };
      const response = await dispatch(
        openAngadiyaDialog[1] ? updateEntity(finalData) : addEntity(finalData)
      );
      if (!response.payload?.error) {
        setOpenAngadiyaDialog([false, null]);
        toast.success(response.payload?.message);
        resetForm();
        setOldValues(null); // Reset oldValues after submission
      }
    },
  });

  useEffect(() => {
    if (openAngadiyaDialog[1]) {
      formik.setValues(openAngadiyaDialog[1]);
      setOldValues(openAngadiyaDialog[1]); // Set oldValues when dialog opens with data
    }
  }, [openAngadiyaDialog]);

  const handleCancel = () => {
    setOpenAngadiyaDialog([false, null, null]);
    formik.resetForm();
    setOldValues(null); // Reset oldValues on cancel
  };

  const handleTextInput = (event, name) => {
    const value = event.target.textContent;
    // const updatedValue = removeEnglishWords(value);
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
        open={openAngadiyaDialog[0]}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle className="modalHeader">
          <h3>{openAngadiyaDialog[1] ? "Update" : "Add"} Angadiya</h3>
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
