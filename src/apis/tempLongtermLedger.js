import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apisHeaders } from "../common/apisHeaders.js";

export const addTempLongtermLedgerEntry = createAsyncThunk(
  "addTempLongtermLedgerEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/temp_longterm_ledger/add_temp_longterm_ledger`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// GET API
export const fetchTempLongtermLedgers = createAsyncThunk(
  "fetchTempLongtermLedgers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/temp_longterm_ledger/get_temp_longterm_ledger`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// DELETE API
export const deleteTempLongtermLedger = createAsyncThunk(
  "deleteTempLongtermLedger",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/temp_longterm_ledger/delete_temp_longterm_ledger`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const tempLongtermLedgerDetails = createSlice({
  name: "tempLongtermLedgerDetails",
  initialState: {
    tempLongtermLedgers: [],
    tlLedgersLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTempLongtermLedgerEntry.pending, (state) => {
        state.tlLedgersLoading = true;
        state.error = null;
      })
      .addCase(addTempLongtermLedgerEntry.fulfilled, (state, action) => {
        state.tlLedgersLoading = false;
        // console.log(action.payload.data)
        state.tempLongtermLedgers.push(action.payload.data.ledgerData);
        state.error = null;
      })
      .addCase(addTempLongtermLedgerEntry.rejected, (state, action) => {
        state.tlLedgersLoading = false;
        state.error = action.payload;
      })

      // GET API Reducers
      .addCase(fetchTempLongtermLedgers.pending, (state) => {
        state.tlLedgersLoading = true;
        state.error = null;
      })
      .addCase(fetchTempLongtermLedgers.fulfilled, (state, action) => {
        state.tlLedgersLoading = false;
        state.tempLongtermLedgers = action.payload.data;
        state.error = null;
      })
      .addCase(fetchTempLongtermLedgers.rejected, (state, action) => {
        state.tlLedgersLoading = false;
        state.error = action.payload;
      })

      // DELETE API Reducers
      .addCase(deleteTempLongtermLedger.pending, (state) => {
        state.tlLedgersLoading = true;
        state.error = null;
      })
      .addCase(deleteTempLongtermLedger.fulfilled, (state, action) => {
        state.tlLedgersLoading = false;
        state.tempLongtermLedgers = state.tempLongtermLedgers.filter(
          (ledger) => ledger._id !== action.payload.data.deletedEntry._id
        );
        state.error = null;
      })
      .addCase(deleteTempLongtermLedger.rejected, (state, action) => {
        state.tlLedgersLoading = false;
        state.error = action.payload;
      });
  },
});

export default tempLongtermLedgerDetails.reducer;
