import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apisHeaders } from "../common/apisHeaders.js";

export const getHistory = createAsyncThunk(
  "getHistory",
  async (data, { rejectWithValue }) => {
    // console.log("data---", data);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/history/getHistory`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getHistoryWithMonthAgo = createAsyncThunk(
  "getHistoryWithMonthAgo",
  async (data, { rejectWithValue }) => {
    // console.log("data---", data);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/history/getHistoryWithMonthAgo`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const historySliceDetails = createSlice({
  name: "historySliceDetails",
  initialState: {
    histories: [],
    grpHistories: [],
    hisLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHistory.pending, (state) => {
        state.hisLoading = true;
        state.error = null;
      })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.hisLoading = false;
        state.histories = action.payload.data;
        state.error = null;
      })
      .addCase(getHistory.rejected, (state, action) => {
        state.hisLoading = false;
        state.error = action.payload;
      })

      .addCase(getHistoryWithMonthAgo.pending, (state) => {
        // state.hisLoading = true;
        state.error = null;
      })
      .addCase(getHistoryWithMonthAgo.fulfilled, (state, action) => {
        // state.hisLoading = false;
        state.grpHistories = action.payload.data;
        state.error = null;
      })
      .addCase(getHistoryWithMonthAgo.rejected, (state, action) => {
        // state.hisLoading = false;
        state.error = action.payload;
      });
  },
});

// export const { setDebitTeams, setCreditTeams } = historySliceDetails.actions;

export default historySliceDetails.reducer;
