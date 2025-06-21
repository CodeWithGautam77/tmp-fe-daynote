import { LoadingButton } from "@mui/lab";
import styles from "./logic.module.scss";
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loginUser } from "../../apis/authSlice";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  phone: yup
    .string("Enter your phone number")
    .matches(/^[0-9]+$/, "Phone number must be only digits")
    .min(10, "Phone number should be at least 10 digits")
    .max(10, "Phone number should not be more than 10 digits")
    .required("Phone number is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isKeepMelogIn, setIsKeepMelogIn] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleKeepMelogIn = () => setIsKeepMelogIn((prev) => !prev);

  const { authLoading } = useSelector((state) => state.authData);

  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // console.log({ ...values, keepMelogIn: isKeepMelogIn });
      const response = await dispatch(
        loginUser({ ...values, keepMelogIn: isKeepMelogIn })
      );
      if (response.payload.error) {
        toast.warning(response.payload.message);
      } else {
        toast.success(response.payload.message);
        navigate("/");
      }
    },
  });
  return (
    <div className={styles.loginMainBox}>
      <div className={styles.innerBox}>
        <h1>Login</h1>
        <form onSubmit={formik.handleSubmit} className={styles.inputBox}>
          <TextField
            fullWidth
            variant="outlined"
            id="phone"
            name="phone"
            type="number"
            placeholder="Enter Phone no."
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            className={
              formik.touched.phone && formik.errors.phone
                ? `${styles.errorBorder}`
                : ""
            }
            sx={{
              outline: "none",
              border: "none",
              width: "100%",
              height: "4rem",
              backgroundColor: "#E2E2E2",
              borderRadius: "5rem",
              padding: ".2rem .5rem",
              "& .MuiInputBase-input": {
                fontSize: "1.2rem",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
              },
            }}
          />
          <div>
            <OutlinedInput
              fullWidth
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              className={
                formik.touched.password && formik.errors.password
                  ? `${styles.errorBorder}`
                  : ""
              }
              sx={{
                outline: "none",
                border: "none",
                width: "100%",
                height: "4rem",
                backgroundColor: "#E2E2E2",
                borderRadius: "5rem",
                padding: ".2rem .5rem",
                "& .MuiInputBase-input": {
                  fontSize: "1.2rem",
                  border: "none",
                },
                "& fieldset": {
                  border: "none", // Remove the default border
                },
              }}
              endAdornment={
                <InputAdornment position="end" sx={{ paddingRight: "1rem" }}>
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {formik.touched.password && formik.errors.password && (
              <div className={styles.errorText}>{formik.errors.password}</div>
            )}
          </div>
          <div className={styles.checkboxWrapper}>
            <input
              className={styles.inpCbx}
              id="morning"
              type="checkbox"
              onChange={handleKeepMelogIn}
            />
            <label className={styles.cbx} htmlFor="morning">
              <span>
                <svg width="12px" height="10px">
                  <use xlinkHref="#check-4"></use>
                </svg>
              </span>
              <span>Keep Me Logged in</span>
            </label>
            <svg className={styles.inlineSvg}>
              <symbol id="check-4" viewBox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
              </symbol>
            </svg>
          </div>
          <LoadingButton
            type="submit"
            className={styles.submitButton}
            loading={authLoading}
            loadingPosition="end"
            endIcon={<span />}
          >
            Login
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}
