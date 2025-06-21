import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addDebitEntity,
  addEntity,
  getEntitysCityCount,
  updateEntity,
} from "../../apis/entitySlice.js";
import { forwardRef, Fragment, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import WriteDivField from "../../components/WriteDivField.js";
import DailogStyle from "./DailogStyle.module.scss";
import {
  calculatePercentageAmount,
  phoneConvertGujaratiToEnglish,
  removeEnglishWords,
  removeWords,
} from "../../common/common.js";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { addUserCities } from "../../apis/citySlice.js";
import { addBorrowEntry } from "../../apis/borrowSlice.js";
import moment from "moment";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const validationSchema = yup.object({
  name: yup.string("Enter supplier name").required("Name is required"),
  searchName: yup
    .string("Enter customer search name")
    .required("Search name is required"),
  // city: yup.string("Enter city").required("City is required"),
  // phone: yup
  //   .string("Enter phone number")
  //   .min(10, "Phone number should be 10 digits")
  //   .max(10, "Phone number should be 10 digits")
  //   .required("Phone is required"),
  amount: yup
    .number("Enter amount")
    .required("Amount is required")
    .test(
      "not-zero",
      "Amount cannot be zero",
      (value) => value && !/^[0]+$/.test(value)
    ),
  // reference: yup.string("Enter reference"),
  // note: yup.string("Enter note"),
});

export default function SupplierDialog(props) {
  const {
    openSupplierDialog,
    setOpenSupplierDialog,
    setIsAddNew,
    formikBuy,
    setOpenAutoSubmit,
    setIsBuyWriting,
  } = props;
  const dispatch = useDispatch();

  const { loggedIn } = useSelector((state) => state.authData);
  const { cities } = useSelector((state) => state.citiesData);
  const { entLoading, citycount } = useSelector((state) => state.entData);
  const currentDate = useSelector((state) => state.date.currentDate);

  const [selectedSuggestedText, setSelectedSuggestedText] = useState("");
  const [oldValues, setOldValues] = useState({
    name: "",
    searchName: "",
    phone: "",
    amount: "",
    reference: "",
    note: "",
  });

  useEffect(() => {
    dispatch(getEntitysCityCount({ uId: loggedIn?._id, type: "S" }));
  }, [loggedIn]);

  const handleCancel = () => {
    setOpenSupplierDialog([false, null, null]);
    setSelectedSuggestedText("");
    formik.resetForm();
    setIsAddNew(false);
    setOldValues({
      name: "",
      searchName: "",
      phone: "",
      amount: "",
      reference: "",
      note: "",
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      searchName: "",
      city: "",
      phone: "",
      amount: "",
      reference: "",
      note: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const cutOffPercentage = loggedIn?.cutOff || null;

      let finalData = {};
      if (openSupplierDialog[1]) {
        finalData = {
          ...values,
          uId: loggedIn?._id,
          // amount: (parseFloat(values.amount) * 0.1).toFixed(2),
          type: "S",
          checkCity: cities.includes(values.city),
        };
        if (!(oldValues.amount == values.amount)) {
          finalData.amount = cutOffPercentage
            ? calculatePercentageAmount(finalData.amount, cutOffPercentage)
            : finalData.amount;
        }
      } else {
        finalData = {
          ...values,
          uId: loggedIn?._id,
          name: `${values.name} ${selectedSuggestedText}`,
          type: "S",
          amount: 0,
          checkCity: cities.includes(values.city),
          openingBalance: cutOffPercentage
            ? calculatePercentageAmount(values?.amount, cutOffPercentage)
            : values?.amount,
        };
      }
      const response = await dispatch(
        openSupplierDialog[1] ? updateEntity(finalData) : addEntity(finalData)
      );
      if (!response.payload?.error) {
        if (!finalData.checkCity) {
          dispatch(addUserCities([finalData.city]));
        }
        setOpenSupplierDialog([false, null]);
        setSelectedSuggestedText("");
        resetForm();
        toast.success(response.payload?.message);
        setIsBuyWriting(false);
        if (!openSupplierDialog[1]) {
          dispatch(
            await addBorrowEntry({
              type: "B",
              uId: loggedIn._id,
              date: moment(currentDate)?.format("YYYY-MM-DD"),
              entryId: response.payload?.data?._id,
              amount: cutOffPercentage
                ? calculatePercentageAmount(values?.amount, cutOffPercentage)
                : values?.amount,
              inputText: values.name,
              isOpen: true,
            })
          );
        }
        formikBuy.resetForm();
        setOldValues({
          name: "",
          searchName: "",
          phone: "",
          amount: "",
          reference: "",
          note: "",
        });
        setIsAddNew(false);
      }
    },
  });

  useEffect(() => {
    if (openSupplierDialog[1]) {
      setOldValues(openSupplierDialog[1]);
      formik.setValues(openSupplierDialog[1]);
    }
  }, [openSupplierDialog]);

  const handleSelectInput = (event, name) => {
    const value = event.target.value;
    formik.setFieldValue(name, value);
  };

  const handleTextInput = (event, name) => {
    const value = event.target.textContent;
    const updatedValue = removeEnglishWords(value);
    formik.setFieldValue(name, updatedValue);
  };

  const handleNumberInput = (event, name) => {
    const value = event.target.textContent;
    const translatedValue = phoneConvertGujaratiToEnglish(value);
    // const translatedValue =
    //   name === "amount"
    //     ? convertGujaratiToEnglish(value)
    //     : name === "phone"
    //     ? phoneConvertGujaratiToEnglish(value)
    //     : value;
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

  useEffect(() => {
    if (!openSupplierDialog[1] && formik.values.name) {
      setOldValues((old) => ({
        ...old,
        name: `${formik.values.name} ${selectedSuggestedText}`,
      }));
    }
    if (openSupplierDialog[1] && formik.values.name && selectedSuggestedText) {
      const updatedText = removeWords(formik.values.name, [
        "બેંગલ્સ",
        "પ્લાસ્ટીક",
        "એન્ટરપ્રાઇઝ",
        "ઇન્ડસ્ટ્રીઝ",
      ]);
      setOldValues((old) => ({
        ...old,
        name: `${updatedText} ${selectedSuggestedText}`,
      }));
      formik.setFieldValue("name", `${updatedText} ${selectedSuggestedText}`);
    }
  }, [formik.values.name, selectedSuggestedText]);

  const fields = [
    {
      name: "name",
      placeholder: "નામ",
      handler: handleTextInput,
      type: "text",
      suggestions: ["બેંગલ્સ", "પ્લાસ્ટીક", "એન્ટરપ્રાઇઝ", "ઇન્ડસ્ટ્રીઝ"],
    },
    {
      name: "searchName",
      placeholder: "સર્ચ નામ",
      handler: handleTextInput,
      type: "text",
      // suggestions: ["નોવેલ્ટી", "સ્ટોર્સ", "ટ્રેડર્સ", "બેંગલ્સ"],
    },
    {
      name: "city",
      placeholder: "Select city",
      handler: handleSelectInput,
      type: "select",
      // menuArray: cities,
    },
    {
      name: "city",
      placeholder: "સીટી",
      handler: handleTextInput,
      type: "text",
    },
    {
      name: "phone",
      placeholder: "ફોન નંબર",
      handler: handleNumberInput,
      type: "number",
    },
    {
      name: "amount",
      placeholder: "રકમ",
      handler: handleNumberInput,
      type: "number",
    },
    {
      name: "reference",
      placeholder: "રેફ્રન્સ",
      handler: handleTextInput,
      type: "text",
    },
    {
      name: "note",
      placeholder: "નોટ",
      handler: handleTextInput,
      type: "text",
    },
  ];

  const handleSuggestionTextSelection = (type) => {
    if (selectedSuggestedText.includes(type)) {
      setSelectedSuggestedText("");
    } else {
      setSelectedSuggestedText(type); // Update the selected type
    }
  };

  return (
    <Fragment>
      <Dialog
        open={openSupplierDialog[0]}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle className="modalHeader">
          <h3>{openSupplierDialog[1] ? "Update" : "Add"} Supplier</h3>
        </DialogTitle>
        <DialogContent className="modalContent">
          <form onSubmit={formik.handleSubmit}>
            {fields.map((field, index) =>
              entLoading ? (
                <div key={index} className={`inputBox ${DailogStyle.wrtieDiv}`}>
                  Loading...
                </div>
              ) : (
                <div className="inputBox" key={index}>
                  {field.type === "select" ? (
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        {field.placeholder}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formik.values.city || ""}
                        label={field.placeholder}
                        onChange={(e) => field.handler(e, field.name)}
                        error={
                          formik.touched[field.name] &&
                          formik.errors[field.name]
                        }
                      >
                        {citycount?.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item.city}>
                              {item.city}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  ) : (
                    <>
                      <Typography
                        fontWeight={550}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {field.name !== "city" ? oldValues[field.name] : null}
                      </Typography>
                      <div style={{ width: "100%" }}>
                        <div
                          style={{ width: "100%" }}
                          className={
                            formik.touched[field.name] &&
                            formik.errors[field.name]
                              ? DailogStyle.wrtieBoxError
                              : DailogStyle.wrtieBox
                          }
                        >
                          <WriteDivField
                            style={{ width: "100%" }}
                            customClass={DailogStyle.wrtieDiv}
                            // customClass={
                            //   formik.touched[field.name] &&
                            //   formik.errors[field.name]
                            //     ? DailogStyle.wrtieErrorDiv
                            //     : DailogStyle.wrtieDiv
                            // }
                            handleInput={(e) => field.handler(e, field.name)}
                            handleBlur={() => handleBlur(field.name)}
                            placeholder={field.placeholder}
                          />
                        </div>
                        {field.suggestions && (
                          <div className={DailogStyle.buttonContainer}>
                            {field.suggestions.map((item, index) => {
                              return (
                                <label key={index}>
                                  <input
                                    type="checkbox"
                                    checked={selectedSuggestedText === item}
                                    onChange={() =>
                                      handleSuggestionTextSelection(item)
                                    }
                                  />
                                  {item}
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  )}
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
    </Fragment>
  );
}
