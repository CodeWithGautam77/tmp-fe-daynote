import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apisHeaders } from "../common/apisHeaders.js";

// Common function to handle JWT expiration
function handleJwtExpired(error) {
  if (
    error?.response?.data?.error === true &&
    error?.response?.data?.message === "jwt expired"
  ) {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  }
}

export const createUser = createAsyncThunk(
  "createUser",
  async (data, { rejectWithValue }) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (adminToken) {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_API}/auth/createuser`,
          { token: adminToken, ...data },
          apisHeaders
        );
        return response.data;
      } else {
        return {};
      }
    } catch (error) {
      handleJwtExpired(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchUser = createAsyncThunk(
  "searchUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/auth/searchuser`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUsers = createAsyncThunk(
  "getUsers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/user/getusers`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "updateUser",
  async (data, { rejectWithValue }) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (adminToken) {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_API}/auth/updateUserById`,
          { token: adminToken, ...data },
          apisHeaders
        );
        return response.data;
      } else {
        return {};
      }
    } catch (error) {
      handleJwtExpired(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const userSliceDetails = createSlice({
  name: "userSliceDetails",
  initialState: {
    users: [],
    totalUsers : 0,
    userLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.users.push(action.payload.data);
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload;
      })

      .addCase(getUsers.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.userLoading = false;
        state.users = action.payload.data;
        state.totalUsers = action.payload.totalCount;
        state.error = null;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload;
      })

      .addCase(updateUser.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userLoading = false;
        const { data } = action.payload;
        state.users = state.users.map((user) =>
          user._id === data._id ? { ...user, ...data } : user
        );
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload;
      });
  },
});

export default userSliceDetails.reducer;
