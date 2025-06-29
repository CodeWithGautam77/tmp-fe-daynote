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
import { removeEnglishWords } from "../../common/common.js";
import DailogStyle from "./DailogStyle.module.scss";
import WriteDivField from "../../components/WriteDivField.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const validationSchema = yup.object({
  name: yup.string("Enter supplier name").required("Name is required"),
  note: yup.string("Enter note"),
});

export default function ShopExpenseDialog(props) {
  const { openShopExpenseDialog, setOpenShopExpenseDialog } = props;
  const dispatch = useDispatch();
  const { entLoading } = useSelector((state) => state.entData);
  const { loggedIn } = useSelector((state) => state.authData);

  const formik = useFormik({
    initialValues: {
      name: "",
      note: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const finalData = {
        ...values,
        uId: loggedIn?._id,
        type: "SE",
        // name: `${values.name} આંગડીયા`,
      };
      const response = await dispatch(
        openShopExpenseDialog[1]
          ? updateEntity(finalData)
          : addEntity(finalData)
      );
      if (!response.payload?.error) {
        setOpenShopExpenseDialog([false, null]);
        toast.success(response.payload?.message);
        resetForm();
      }
    },
  });

  useEffect(() => {
    if (openShopExpenseDialog[1]) {
      formik.setValues(openShopExpenseDialog[1]);
    }
  }, [openShopExpenseDialog]);

  const handleCancel = () => {
    setOpenShopExpenseDialog([false, null, null]);
    formik.resetForm();
  };

  const handleTextInput = (event, name) => {
    const value = event.target.textContent;
    // const updatedValue = removeEnglishWords(value);
    formik.setFieldValue(name, value);
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
      name: "note",
      placeholder: "નોટ",
      handler: handleTextInput,
      type: "text",
    },
  ];

  return (
    <React.Fragment>
      <Dialog
        open={openShopExpenseDialog[0]}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle className="modalHeader">
          <h3>{openShopExpenseDialog[1] ? "Update" : "Add"} Shop Expense</h3>
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
