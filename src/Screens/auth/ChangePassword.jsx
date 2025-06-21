import { LoadingButton } from "@mui/lab";
import styles from "./logic.module.scss";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../common/common";
import axios from "axios";
import { apisHeaders } from "../../common/apisHeaders";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  oldPassword: yup.string("Enter your old password").required("required"),
  password: yup
    .string("Enter your new password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("required")
    .test(
      "not-same-as-old",
      "New password should be different from old password.",
      function (value) {
        const { oldPassword } = this.parent;
        return value !== oldPassword;
      }
    ),
  confirmPassword: yup
    .string("Enter your confirm password")
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("required"),
});

export default function ChangePassword() {
  const navigate = useNavigate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      setLoading(true);
      const authToken = getAuthToken();

      try {
        if (authToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_API}/auth/changepassword`,
            { token: authToken, ...values },
            apisHeaders
          );
          if (!response?.data?.error) {
            toast.success(response?.data?.message);
            navigate("/auth/login");
          } else {
            setFieldError("oldPassword", response?.data?.message);
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <div className={styles.loginMainBox}>
      <div className={styles.innerBox}>
        <h1>Change Password</h1>
        <form onSubmit={formik.handleSubmit} className={styles.inputBox}>
          <div>
            <OutlinedInput
              fullWidth
              id="oldPassword"
              name="oldPassword"
              type={showOldPassword ? "text" : "password"}
              placeholder="Enter Old Password"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
              }
              className={
                formik.touched.oldPassword && formik.errors.oldPassword
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
                    onClick={handleClickShowOldPassword}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {formik.touched.oldPassword && formik.errors.oldPassword && (
              <div className={styles.errorText}>
                {formik.errors.oldPassword}
              </div>
            )}
          </div>
          <div>
            <OutlinedInput
              fullWidth
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
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
          <div>
            <OutlinedInput
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              className={
                formik.touched.confirmPassword && formik.errors.confirmPassword
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
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className={styles.errorText}>
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>
          <LoadingButton
            type="submit"
            className={styles.submitButton}
            loading={loading}
            loadingPosition="end"
            endIcon={<span />}
          >
            Submit
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}
