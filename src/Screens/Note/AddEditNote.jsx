import { useDispatch, useSelector } from "react-redux";
import Style from "./AddEditNote.module.scss";
import moment from "moment";
import WriteDivField from "../../components/WriteDivField";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  DeleteSweetAlert,
  phoneConvertGujaratiToEnglish,
  removeEnglishWords,
} from "../../common/common";
import { createNote, deleteNote, updateNote } from "../../apis/noteSlice";
import { LoadingButton } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ValidationSchema = yup.object({
  amount: yup
    .string()
    .required("Please enter amount")
    .test(
      "not-zero",
      "Amount cannot be zero",
      (value) => value && !/^[0]+$/.test(value)
    ),
  name: yup.string().required("Please enter name"),
});

export default function AddEditNote(props) {
  const { openNoteDialog, setOpenNoteDialog } = props;
  
  const dispatch = useDispatch();

  const { loggedIn } = useSelector((state) => state.authData);
  const { notesLoading } = useSelector((state) => state.noteData);
  const currentDate = useSelector((state) => state.date.currentDate);

  const formik = useFormik({
    initialValues: {
      name: "",
      amount: "",
      text: "",
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      const finalData = {
        ...values,
        uId: loggedIn._id,
        date: openNoteDialog[1]
          ? openNoteDialog[1].date
          : moment(currentDate)?.format("YYYY-MM-DD"),
      };
      const response = await dispatch(
        openNoteDialog[1] ? updateNote(finalData) : createNote(finalData)
      );
      if (!response.payload?.error) {
        toast.success(response.payload?.message);
        resetForm();
        handleCancel();
      }
    },
  });

  const handelAmtInput = (event) => {
    const value = event.target.textContent;
    const translatedValue = phoneConvertGujaratiToEnglish(value);
    const isNumeric = /^\d+(\.\d+)?$/.test(translatedValue);
    if (isNumeric) {
      formik.setFieldValue("amount", translatedValue);
    }
  };

  const handleNameInput = (event) => {
    const value = event.target.textContent;
    if (value) {
      const updatedValue = removeEnglishWords(value);
      formik.setFieldValue("name", updatedValue);
    } else {
      formik.setFieldValue("name", "");
    }
  };

  const handleTextnput = (event) => {
    const el = event.target;

    // Tablet/soft-keyboard sometimes inserts \n instead of <br>
    // Replace newline characters with <br> to preserve line breaks visually

    let value = el.innerHTML;
    // Optional: Normalize `div` if newline is added as `\n` (less common)
    if (value.includes("\n")) {
      value = value.replace(/\n/g, "<br>");
      el.innerHTML = value;

      // Move cursor to the end after update
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    formik.setFieldValue("text", value);
  };

  useEffect(() => {
    if (openNoteDialog[0] && openNoteDialog[1]) {
      formik.setValues(openNoteDialog[1]);
    }
  }, [openNoteDialog]);

  const handeDelete = async (data) => {
    if (
      data.amount !== "" &&
      data.amount !== null &&
      data.amount !== undefined &&
      data._id
    ) {
      setOpenNoteDialog([false, openNoteDialog[1]]);
      const response = () => dispatch(deleteNote({ id: data._id }));
      DeleteSweetAlert({
        title: "Are you sure you want to delete this note?",
        icon1: "warning",
        title2: `${data.name}`,
        text: "Entry deleted successfully",
        icon2: "success",
        callApi: response,
        setOldData: () => setOpenNoteDialog([false, null]),
      });
    }
  };

  const handleCancel = () => {
    setOpenNoteDialog([false, null]);
    formik.setValues({
      name: "",
      amount: "",
      text: "",
    });
  };

  return (
    <React.Fragment>
      <Dialog
        open={openNoteDialog[0]}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle className="modalHeader">
          <h3>{openNoteDialog[1] ? "Update" : "Add"} Note</h3>
        </DialogTitle>
        <DialogContent
          className="modalContent"
          style={{ padding: ".5rem .5rem" }}
        >
          <div className={`flex gap-05 ${Style.nameBox}`}>
            <div className={`flexCenter ${Style.dateBox} ${Style.border}`}>
              {openNoteDialog[1]
                ? moment(openNoteDialog[1].date).format("DD-MM-YYYY")
                : moment(currentDate).format("DD-MM-YYYY")}
            </div>
            <div style={{ width: "47%" }}>
              {openNoteDialog[1] && (
                <Typography
                  fontWeight={550}
                  sx={{ textTransform: "capitalize" }}
                >
                  {openNoteDialog[1]?.name}
                </Typography>
              )}
              <div style={{ width: "100%" }} className={`${Style.border}`}>
                <WriteDivField
                  handleInput={handleNameInput}
                  customClass={Style.input}
                  placeholder="નામ"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div style={{ width: "31%" }}>
              {openNoteDialog[1] && (
                <Typography
                  fontWeight={550}
                  sx={{ textTransform: "capitalize" }}
                >
                  {openNoteDialog[1]?.amount}
                </Typography>
              )}
              <div style={{ width: "100%" }} className={`${Style.border}`}>
                <WriteDivField
                  handleInput={handelAmtInput}
                  customClass={Style.input}
                  placeholder="રકમ"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
          {openNoteDialog[1] && (
            <div className="w-100" style={{ margin: ".5rem 0rem" }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600} fontSize={17}>
                    Particulars
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    dangerouslySetInnerHTML={{ __html: openNoteDialog[1].text }}
                  />
                </AccordionDetails>
              </Accordion>
            </div>
          )}
          <div
            style={{ width: "100%", marginTop: ".3rem" }}
            className={`${Style.border}`}
          >
            <WriteDivField
              handleInput={handleTextnput}
              placeholder="Particulars"
              style={{ width: "100%", height: "20rem" }}
            />
          </div>
          <DialogActions className="modalFooter flex gap-2">
            <Button
              variant="contained"
              onClick={handleCancel}
              className="cancelBtn"
            >
              Cancel
            </Button>
            {openNoteDialog[1] && (
              <LoadingButton
                loading={notesLoading}
                variant="contained"
                type="button"
                color="error"
                onClick={() => handeDelete(openNoteDialog[1])}
                endIcon={<span />}
              >
                Delete
              </LoadingButton>
            )}
            <LoadingButton
              disabled={!formik.isValid || !formik.dirty}
              variant="contained"
              // style={{ minWidth: "100%", marginTop: ".5rem" }}
              size="small"
              onClick={formik.handleSubmit}
              loading={notesLoading}
              loadingPosition="end"
              endIcon={<span />}
            >
              {openNoteDialog[1] ? "Update" : "Create"}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
