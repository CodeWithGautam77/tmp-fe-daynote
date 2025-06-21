import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apisHeaders } from "../common/apisHeaders.js";
// ----------------For addLongtermBorrowEntry----------------------------\\

export const addLongtermBorrowEntry = createAsyncThunk(
  "addLongtermBorrowEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/longbrow/addLongtermBorrowEntry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllLongtermBorrow = createAsyncThunk(
  "getAllLongtermBorrow",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/longbrow/getAllLongtermBorrow`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteLongtermEntry = createAsyncThunk(
  "deleteLongtermEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/longbrow/deleteLongtermEntry`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateLongtermBorrow = createAsyncThunk(
  "updateLongtermBorrow",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/longbrow/updateLongtermBorrow`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const undoEntry = createAsyncThunk(
  "undoEntry",
  async (data, { rejectWithValue }) => {
    // console.log(data);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/longbrow/undoEntry`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const borrowSliceDetails = createSlice({
  name: "borrowSliceDetails",
  initialState: {
    longtermBorrow: [],
    longtermBorrowLoading: false,
    dayTotalAmt: 0,
    error: null,
  },
  reducers: {
    updatelongtermBorrow: (state, action) => {
      const newObj = action.payload;
      // const index = state.tempBorrow.map((item) => item._id === newObj._id);
      state.longtermBorrow = state.longtermBorrow.map((item) =>
        item._id === newObj._id ? { ...item, amount: newObj.amount } : item
      );
      state.dayTotalAmt += newObj.amount;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addLongtermBorrowEntry.pending, (state) => {
        // state.longtermBorrowLoading = true;
        state.error = null;
      })
      .addCase(addLongtermBorrowEntry.fulfilled, (state, action) => {
        state.longtermBorrowLoading = false;
        const { data } = action.payload;
        const emptyObject = { entName: "", amount: "" };

        const emptyIndex = state.longtermBorrow.findIndex(
          (item) =>
            item.entName === emptyObject.entName &&
            item.amount === emptyObject.amount
        );

        if (emptyIndex !== -1) {
          // Replace the empty object with the new data
          state.longtermBorrow[emptyIndex] = data;
        } else {
          // Add the new data to the end of the array
          state.longtermBorrow.push(data);
        }
        state.dayTotalAmt += data.amount;
        state.error = null;
      })
      .addCase(addLongtermBorrowEntry.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getAllLongtermBorrow.pending, (state) => {
        state.longtermBorrowLoading = true;
        state.error = null;
      })
      .addCase(getAllLongtermBorrow.fulfilled, (state, action) => {
        state.longtermBorrowLoading = false;
        state.longtermBorrow = action.payload?.data?.longtermBorrowData;
        state.dayTotalAmt = action.payload?.data?.longtermBorrowTotal;
        state.error = null;
      })
      .addCase(getAllLongtermBorrow.rejected, (state, action) => {
        state.longtermBorrowLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteLongtermEntry.pending, (state) => {
        state.longtermBorrowLoading = true;
        state.error = null;
      })
      .addCase(deleteLongtermEntry.fulfilled, (state, action) => {
        state.longtermBorrowLoading = false;
        const { data } = action.payload;
        state.longtermBorrow = state.longtermBorrow.filter(
          (item) => item._id !== data._id
        );
        state.longtermBorrow.push({ entName: "", amount: "" });
        state.dayTotalAmt -= data.amount;
        state.error = null;
      })
      .addCase(deleteLongtermEntry.rejected, (state, action) => {
        state.longtermBorrowLoading = false;
        state.error = action.payload;
      })

      .addCase(updateLongtermBorrow.pending, (state) => {
        state.longtermBorrowLoading = true;
        state.error = null;
      })
      .addCase(updateLongtermBorrow.fulfilled, (state, action) => {
        state.longtermBorrowLoading = false;
        const { data } = action.payload;
        state.longtermBorrow = state.longtermBorrow.map((item) =>
          item._id === data._id ? data : item
        );
        state.error = null;
      })
      .addCase(updateLongtermBorrow.rejected, (state, action) => {
        state.longtermBorrowLoading = false;
        state.error = action.payload;
      })

      .addCase(undoEntry.pending, (state) => {
        state.error = null;
      })
      .addCase(undoEntry.fulfilled, (state, action) => {
        state.longtermBorrowLoading = false;
        const { data } = action.payload;
        const emptyObject = { entName: "", amount: "" };

        const emptyIndex = state.longtermBorrow.findIndex(
          (item) =>
            item.entName === emptyObject.entName &&
            item.amount === emptyObject.amount
        );

        if (emptyIndex !== -1) {
          state.longtermBorrow[emptyIndex] = data;
        } else {
          state.longtermBorrow.push(data);
        }
        state.dayTotalAmt += data.amount;
        state.error = null;
      })
      .addCase(undoEntry.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { updatelongtermBorrow } = borrowSliceDetails.actions;

export default borrowSliceDetails.reducer;
