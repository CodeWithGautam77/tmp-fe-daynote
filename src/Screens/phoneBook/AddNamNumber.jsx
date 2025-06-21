import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { Fragment } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import WriteDivField from "../../components/WriteDivField.js";
import AddPhoneStyle from "./AddNamNumber.module.scss";
import { phoneConvertGujaratiToEnglish } from "../../common/common.js";
import { addNameNumber } from "../../apis/phoneBookSlice.js";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  name: yup.string("Enter customer name").required("Name is required"),
  phone: yup
    .string("Enter phone number")
    .min(10, "Phone number should be 10 digits")
    .max(10, "Phone number should be 10 digits")
    .required("Phone is required"),
});

export default function AddNamNumber({ setIsAddnew }) {
  const dispatch = useDispatch();

  const { pbookLoading } = useSelector((state) => state.pBookData);
  const { loggedIn } = useSelector((state) => state.authData);

  // console.log(cities);
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      city: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const finalData = {
        ...values,
        uId: loggedIn?._id,
      };
      // console.log(finalData);
      // const response = await dispatch(
      //   openCustomerDialog[1] ? updateEntity(finalData) : addEntity(finalData)
      // );
      const response = await dispatch(addNameNumber(finalData));
      if (!response.payload?.error) {
        handleClose();
        toast.success(response.payload?.message);
        // setOpenAutoSubmit(false);
      }
    },
  });

  //   useEffect(() => {
  //     if (openCustomerDialog[1]) {
  //       formik.setValues(openCustomerDialog[1]);
  //     }
  //   }, [openCustomerDialog]);

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

  const handleClose = () => {
    // setOpenCustomerDialog([false, null, null]);
    // setSelectedSuggestedText("");
    formik.resetForm();
    setIsAddnew(false);
  };

  // Array of field configurations
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
      type: "number",
    },
    {
      name: "city",
      placeholder: "સીટી",
      handler: handleTextInput,
      type: "text",
    },
  ];

  return (
    <Fragment>
      <form onSubmit={formik.handleSubmit} className="inputBox">
        {fields.map((field, index) =>
          pbookLoading ? (
            <div key={index} className={`inputBox ${AddPhoneStyle.wrtieDiv}`}>
              Loading...
            </div>
          ) : (
            <div className="inputBox" key={index}>
              <div style={{ width: "100%", display: "flex" }}>
                <WriteDivField
                  style={{ width: "100%" }}
                  customClass={
                    formik.touched[field.name] && formik.errors[field.name]
                      ? AddPhoneStyle.wrtieErrorDiv
                      : AddPhoneStyle.wrtieDiv
                  }
                  handleInput={(e) => field.handler(e, field.name)}
                  handleBlur={() => handleBlur(field.name)}
                  placeholder={field.placeholder}
                />
              </div>
              {formik.touched[field.name] && formik.errors[field.name] && (
                <div className={AddPhoneStyle.errorText}>
                  {formik.errors[field.name]}
                </div>
              )}
            </div>
          )
        )}

        <div className="modalFooter flex gap-05">
          <Button
            variant="contained"
            onClick={handleClose}
            className="cancelBtn"
          >
            Cancel
          </Button>
          <LoadingButton
            loading={pbookLoading}
            variant="contained"
            type="submit"
            className="submitBtn"
            endIcon={<span />}
          >
            Submit
          </LoadingButton>
        </div>
      </form>
    </Fragment>
  );
}
