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
import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Typography } from "@mui/material";
import { addTeam, updateTeam } from "../../apis/teamSlice.js";
import {
  convertGujaratiToEnglish,
  phoneConvertGujaratiToEnglish,
} from "../../common/common.js";
import WriteDivField from "../../components/WriteDivField.js";
import DailogStyle from "./DailogStyle.module.scss";
import { useState } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const validationSchema = yup.object({
  name: yup.string("Enter supplier name").required("Name is required"),
  phone: yup
    .string("Enter phone number")
    .min(10, "Phone number should be 10 digits")
    .max(10, "Phone number should be 10 digits")
    .required("Phone is required"),
  salary: yup.number("Enter salary").required("Salary is required"),
  absent: yup.number("Enter absent").required("Absent is required"),
  adSalary: yup
    .number("Enter advance salary")
    .required("Advance Salary is required"),
});

export default function TeamDialog(props) {
  const { openTeamDialog, setOpenTeamDialog, setIsAddNew } = props;
  const dispatch = useDispatch();
  const { teamLoading } = useSelector((state) => state.teamData);
  const { loggedIn } = useSelector((state) => state.authData);
  // console.log("loggedIn -->", loggedIn);
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      salary: "",
      absent: "",
      adSalary: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let finalData = {};
      if (openTeamDialog[1]) {
        finalData = {
          ...values,
          uId: loggedIn?._id,
        };
      } else {
        finalData = {
          ...values,
          uId: loggedIn?._id,
          name: `${values.name.toLowerCase()} મેતો`,
        };
      }
      const response = await dispatch(
        openTeamDialog[1] ? updateTeam(finalData) : addTeam(finalData)
      );
      if (!response.payload?.error) {
        handleClose();
        toast.success(response.payload?.message);
      }
    },
  });

  const [oldValues, setOldValues] = useState({
    name: "",
    phone: "",
    salary: "",
    absent: "",
    adSalary: "",
  });

  const handleTextInput = (event, name) => {
    const value = event.target.textContent;
    formik.setFieldValue(name, value);
  };

  const handleNumberInput = (event, name) => {
    const value = event.target.textContent;
    const translatedValue = phoneConvertGujaratiToEnglish(value);
    // const translatedValue =
    //   name === "phone"
    //     ? phoneConvertGujaratiToEnglish(value)
    //     : convertGujaratiToEnglish(value);
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
      name: "phone",
      placeholder: "ફોન નંબર",
      handler: handleNumberInput,
      type: "text",
    },
    {
      name: "salary",
      placeholder: "પાગર",
      handler: handleNumberInput,
      type: "number",
    },
    {
      name: "absent",
      placeholder: "રજા",
      handler: handleNumberInput,
      type: "number",
    },
    {
      name: "adSalary",
      placeholder: "ઉપાડ",
      handler: handleNumberInput,
      type: "number",
    },
  ];

  useEffect(() => {
    if (openTeamDialog[1]) {
      setOldValues(openTeamDialog[1]);
      formik.setValues(openTeamDialog[1]);
    }
  }, [openTeamDialog]);

  const handleClose = () => {
    setOpenTeamDialog([false, null, null]);
    formik.resetForm();
    setOldValues({
      name: "",
      phone: "",
      salary: "",
      absent: "",
      adSalary: "",
    });
  };

  const handleCancel = () => {
    setOpenTeamDialog([false, null, null]);
    formik.resetForm();
    setIsAddNew(false);
    setOldValues({
      name: "",
      phone: "",
      salary: "",
      absent: "",
      adSalary: "",
    });
  };

  // const handleCreditInput = (event) => {
  //   console.log(event.target);
  //   // const value = event.target.textContent;
  //   // formikCredit.setFieldValue("inputText", value);
  // };

  return (
    <React.Fragment>
      <Dialog
        open={openTeamDialog[0]}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle className="modalHeader">
          <h3>{openTeamDialog[1] ? "Update" : "Add"} Member</h3>
        </DialogTitle>
        <DialogContent className="modalContent">
          {/* <form onSubmit={formik.handleSubmit}>
            <div className="inputBox">
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
                label="Phone"
                fullWidth
                // className={ProblemStyle.input}
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </div>
            <div className="inputBox">
              <TextField
                size="small"
                type="number"
                label="Salary"
                fullWidth
                name="salary"
                value={formik.values.salary}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.salary && Boolean(formik.errors.salary)}
                helperText={formik.touched.salary && formik.errors.salary}
              />
            </div>
            <div className="inputBox">
              <TextField
                size="small"
                type="number"
                label="Absent"
                fullWidth
                // className={ProblemStyle.input}
                name="absent"
                value={formik.values.absent}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.absent && Boolean(formik.errors.absent)}
                helperText={formik.touched.absent && formik.errors.absent}
              />
            </div>
            <div className="inputBox">
              <TextField
                size="small"
                label="Advance Salary"
                type="number"
                fullWidth
                // className={ProblemStyle.input}
                name="adSalary"
                value={formik.values.adSalary}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.adSalary && Boolean(formik.errors.adSalary)
                }
                helperText={formik.touched.adSalary && formik.errors.adSalary}
              />
            </div>

            <DialogActions className="modalFooter">
              <Button
                variant="contained"
                onClick={handleCancel}
                className="cancelBtn"
              >
                Cancel
              </Button>
              <LoadingButton
                loading={teamLoading}
                variant="contained"
                type="submit"
                className="submitBtn"
              >
                Submit
              </LoadingButton>
            </DialogActions>
          </form> */}
          <form onSubmit={formik.handleSubmit}>
            {fields.map((field, index) =>
              teamLoading ? (
                <div key={index} className={`inputBox ${DailogStyle.wrtieDiv}`}>
                  Loading...
                </div>
              ) : (
                <div className="inputBox" key={index}>
                  {/* <div style={{ width: "100%", display: "flex" }}> */}
                  <Typography
                    fontWeight={550}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {oldValues[field.name]}
                  </Typography>
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
                      // customClass={
                      //   formik.touched[field.name] && formik.errors[field.name]
                      //     ? DailogStyle.wrtieErrorDiv
                      //     : DailogStyle.wrtieDiv
                      // }
                      handleInput={(e) => field.handler(e, field.name)}
                      handleBlur={() => handleBlur(field.name)}
                      placeholder={field.placeholder}
                    />
                  </div>
                  {/* </div> */}
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
                loading={teamLoading}
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
