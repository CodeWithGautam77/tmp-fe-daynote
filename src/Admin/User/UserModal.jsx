import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { forwardRef, useEffect, useState } from "react";
import { createUser, updateUser } from "../../apis/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

const Transition = forwardRef(function transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function UserModal(props) {
  const { open, setOpen, editData, setEditData } = props;
  const dispatch = useDispatch();
  const { userLoading } = useSelector((state) => state.userData);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    type: "H",
    cutOff: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      type: "H",
      cutOff: "",
    });
    setOpen(false);
    setEditData(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "cutOff" &&
      value &&
      (Number(value) < 0 || Number(value) > 100)
    ) {
      toast.error("cutOff must be between 0 to 100");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Dispatch the createUser action with formData
    const response = await dispatch(
      editData ? updateUser(formData) : createUser(formData)
    );
    if (!response?.payload?.error) {
      handleClose();
      toast.success("Success");
    } else {
      toast.error(response?.payload?.message);
    }
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      fullWidth
    >
      <DialogTitle>{editData ? "Edit User" : "Create User"}</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                size="small"
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
                size="small"
                type="tel"
              />
            </Grid>
            {!editData && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Take Actucal Amout from final amount (cutOff)"
                name="cutOff"
                value={formData.cutOff}
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup
                row
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="H"
                  control={<Radio />}
                  label="Wholesale"
                />
                <FormControlLabel
                  value="R"
                  control={<Radio />}
                  label="Retail"
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined">
          Cancel
        </Button>
        <LoadingButton
          loading={userLoading}
          loadingPosition="end"
          endIcon={<span></span>}
          onClick={handleSubmit}
          variant="contained"
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
