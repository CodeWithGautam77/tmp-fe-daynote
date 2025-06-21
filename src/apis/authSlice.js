import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apisHeaders } from "../common/apisHeaders.js";
import { getAuthToken } from "../common/common.js";

// ----------------For Login------------------------------//

export const loginUser = createAsyncThunk(
  "loginUser",
  async (data, { rejectWithValue }) => {
    try {
      // console.log(data)
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/auth/login`,
        data,
        apisHeaders
      );
      // console.log(response)
      localStorage.setItem("token", response?.data?.token);
      return response.data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserByToken = createAsyncThunk(
  "getUserByToken",
  async (data, { rejectWithValue }) => {
    try {
      const authToken = getAuthToken();
      const adminToken = localStorage.getItem("adminToken");
      if (authToken) {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_API}/auth/getuserbytoken`,
          { token: authToken },
          apisHeaders
        );
        // console.log(response);
        return response.data;
      } else if (adminToken) {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_API}/auth/getuserbytoken`,
          { token: adminToken },
          apisHeaders
        );
        // console.log(response);
        return response.data;
      } else {
        return {};
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const loginAdmin = createAsyncThunk(
  "loginAdmin",
  async (data, { rejectWithValue }) => {
    try {
      // console.log(data)
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/auth/adminlogin`,
        data,
        apisHeaders
      );
      // console.log(response)
      localStorage.setItem("adminToken", response?.data?.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const authSliceDetails = createSlice({
  name: "authSliceDetails",
  initialState: {
    loggedIn: null,
    authLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // loginUser reducers
      .addCase(loginUser.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.loggedIn = action.payload.data;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })

      .addCase(getUserByToken.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(getUserByToken.fulfilled, (state, action) => {
        state.loggedIn = action.payload.data;
        state.authLoading = false;
        state.error = null;
      })
      .addCase(getUserByToken.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })

      .addCase(loginAdmin.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.authLoading = false;
        state.loggedIn = action.payload.data;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      });
  },
});

export default authSliceDetails.reducer;
