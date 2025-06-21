import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apisFileHeaders, apisHeaders } from "../common/apisHeaders.js";
import { insertEntryInOrder, updateBorrowArray } from "../common/common.js";

// ----------------For addBorrowEntry----------------------------\\

export const addBorrowEntry = createAsyncThunk(
  "addBorrowEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/brow/addborrowentry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addForceBorrowEntry = createAsyncThunk(
  "addForceBorrowEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/brow/addForceBorrowEntry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateBorrowEntry = createAsyncThunk(
  "updateBorrowEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/brow/updateBorrowEntry`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBorrowEntrysByDate = createAsyncThunk(
  "getBorrowEntrysByDate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/brow/getallborrows`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addBillImages = createAsyncThunk(
  "addBillImages",
  async (data, { rejectWithValue }) => {
    console.log(data);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/brow/addbillimages/${data.id}`,
        data.formData,
        apisFileHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const calculatesingalDaytotal = createAsyncThunk(
  "calculatesingalDaytotal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/brow/calculatesingalDaytotal`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const calculatePrevDaytotal = createAsyncThunk(
  "calculatePrevDaytotal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/brow/calculatesingalDaytotal`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const calculateOverAllTotal = createAsyncThunk(
  "calculateOverAllTotal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/brow/calculateoveralltotal`,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const calculateSingalDayCredit = createAsyncThunk(
  "calculateSingalDayCredit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/brow/calculatesingaldaycredit`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const calculateSingalDayDebit = createAsyncThunk(
  "calculateSingalDayDebit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/brow/calculatesingaldaydebit`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBorrowEntry = createAsyncThunk(
  "deleteBorrowEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/brow/deleteborrowentry`,
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
    console.log("undoEntryData", data);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/brow/undoEntry`,
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
    buyAcc: [],
    sellAcc: [],
    borrowLoading: false,
    dayTotalAmt: 0,
    prevDayTotalAmt: 0,
    overAllTotalAmt: 0,
    buyDayTotalAmt: 0,
    sellDayTotalAmt: 0,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBorrowEntry.pending, (state) => {
        // state.borrowLoading = true;
        state.error = null;
      })
      .addCase(addBorrowEntry.fulfilled, (state, action) => {
        state.borrowLoading = false;
        const { data } = action.payload;
        const emptyObject = { entName: "", amount: "" };

        if (data?.type === "B") {
          state.buyAcc = updateBorrowArray(state.buyAcc, emptyObject, data);
          state.buyDayTotalAmt += data.amount;
        }
        if (data?.type === "S") {
          state.sellAcc = updateBorrowArray(state.sellAcc, emptyObject, data);
          state.sellDayTotalAmt += data.amount;
        }
        state.error = null;
      })
      .addCase(addBorrowEntry.rejected, (state, action) => {
        // state.borrowLoading = false;
        state.error = action.payload;
      })

      .addCase(addForceBorrowEntry.pending, (state) => {
        // state.borrowLoading = true;
        state.error = null;
      })
      .addCase(addForceBorrowEntry.fulfilled, (state, action) => {
        state.borrowLoading = false;
        const { data } = action.payload;
        const emptyObject = { entName: "", amount: "" };

        if (data?.type === "B") {
          state.buyAcc = updateBorrowArray(state.buyAcc, emptyObject, data);
          state.buyDayTotalAmt += data.amount;
        }
        if (data?.type === "S") {
          state.sellAcc = updateBorrowArray(state.sellAcc, emptyObject, data);
          state.sellDayTotalAmt += data.amount;
        }
        state.error = null;
      })
      .addCase(addForceBorrowEntry.rejected, (state, action) => {
        // state.borrowLoading = false;
        state.error = action.payload;
      })

      .addCase(getBorrowEntrysByDate.pending, (state) => {
        state.borrowLoading = true;
        state.error = null;
      })
      .addCase(getBorrowEntrysByDate.fulfilled, (state, action) => {
        state.borrowLoading = false;
        // console.log(action.payload.data)
        state.buyAcc = action.payload?.data?.buyData;
        state.sellAcc = action.payload?.data?.sellData;
        state.buyDayTotalAmt = action.payload?.data?.buyTotal;
        state.sellDayTotalAmt = action.payload?.data?.sellTotal;
        state.error = null;
      })
      .addCase(getBorrowEntrysByDate.rejected, (state, action) => {
        state.borrowLoading = false;
        state.error = action.payload;
      })

      .addCase(calculatesingalDaytotal.pending, (state) => {
        state.borrowLoading = true;
        state.error = null;
      })
      .addCase(calculatesingalDaytotal.fulfilled, (state, action) => {
        state.borrowLoading = false;
        state.dayTotalAmt = action.payload.data;
        state.error = null;
      })
      .addCase(calculatesingalDaytotal.rejected, (state, action) => {
        state.borrowLoading = false;
        state.error = action.payload;
      })

      .addCase(calculatePrevDaytotal.pending, (state) => {
        state.borrowLoading = true;
        state.error = null;
      })
      .addCase(calculatePrevDaytotal.fulfilled, (state, action) => {
        state.borrowLoading = false;
        state.prevDayTotalAmt = action.payload.data;
        state.error = null;
      })
      .addCase(calculatePrevDaytotal.rejected, (state, action) => {
        state.borrowLoading = false;
        state.error = action.payload;
      })

      .addCase(calculateOverAllTotal.pending, (state) => {
        state.borrowLoading = true;
        state.error = null;
      })
      .addCase(calculateOverAllTotal.fulfilled, (state, action) => {
        state.borrowLoading = false;
        state.overAllTotalAmt = action.payload.data;
        state.error = null;
      })
      .addCase(calculateOverAllTotal.rejected, (state, action) => {
        state.borrowLoading = false;
        state.error = action.payload;
      })

      .addCase(calculateSingalDayCredit.pending, (state) => {
        state.borrowLoading = true;
        state.error = null;
      })
      .addCase(calculateSingalDayCredit.fulfilled, (state, action) => {
        state.borrowLoading = false;
        state.buyDayTotalAmt = action.payload.data;
        state.error = null;
      })
      .addCase(calculateSingalDayCredit.rejected, (state, action) => {
        state.borrowLoading = false;
        state.error = action.payload;
      })

      .addCase(calculateSingalDayDebit.pending, (state) => {
        state.borrowLoading = true;
        state.error = null;
      })
      .addCase(calculateSingalDayDebit.fulfilled, (state, action) => {
        state.borrowLoading = false;
        state.sellDayTotalAmt = action.payload.data;
        state.error = null;
      })
      .addCase(calculateSingalDayDebit.rejected, (state, action) => {
        state.borrowLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteBorrowEntry.pending, (state) => {
        state.borrowLoading = true;
        state.error = null;
      })
      .addCase(deleteBorrowEntry.fulfilled, (state, action) => {
        state.borrowLoading = false;
        const { data } = action.payload;
        if (data.type === "B") {
          state.buyAcc = state.buyAcc.filter((item) => item._id !== data._id);
          state.buyDayTotalAmt -= data.amount;
        }
        if (data.type === "S") {
          state.sellAcc = state.sellAcc.filter((item) => item._id !== data._id);
          state.sellDayTotalAmt -= data.amount;
        }
        state.error = null;
      })
      .addCase(deleteBorrowEntry.rejected, (state, action) => {
        state.borrowLoading = false;
        state.error = action.payload;
      })

      .addCase(updateBorrowEntry.pending, (state) => {
        state.borrowLoading = true;
        state.error = null;
      })
      .addCase(updateBorrowEntry.fulfilled, (state, action) => {
        state.borrowLoading = false;
        const { data } = action.payload;
        if (data?.type === "S") {
          state.sellAcc = state.sellAcc.map((item) =>
            item._id === data._id ? data : item
          );
        }
        if (data?.type === "B") {
          state.buyAcc = state.buyAcc.map((item) =>
            item._id === data._id ? data : item
          );
        }
        state.error = null;
      })
      .addCase(updateBorrowEntry.rejected, (state, action) => {
        state.borrowLoading = false;
        state.error = action.payload;
      })

      .addCase(addBillImages.pending, (state) => {
        state.borrowLoading = true;
        state.error = null;
      })
      .addCase(addBillImages.fulfilled, (state, action) => {
        state.borrowLoading = false;
        const { data } = action.payload;
        if (data.type === "B") {
          state.buyAcc = state.buyAcc.map((item) =>
            item._id === data._id ? { ...item, images: data.images } : item
          );
        }
        if (data.type === "S") {
          state.sellAcc = state.sellAcc.map((item) =>
            item._id === data._id ? { ...item, images: data.images } : item
          );
        }
        state.error = null;
      })
      .addCase(addBillImages.rejected, (state, action) => {
        state.borrowLoading = false;
        state.error = action.payload;
      })

      .addCase(undoEntry.pending, (state) => {
        // state.borrowLoading = true;
        state.error = null;
      })
      .addCase(undoEntry.fulfilled, (state, action) => {
        state.borrowLoading = false;
        const { data } = action.payload;
        const emptyObject = { entName: "", amount: "" };

        if (data?.type === "B") {
          // Find the index of the first empty object in creditAcc
          const emptyIndex = state.buyAcc.findIndex(
            (item) =>
              item.entName === emptyObject.entName &&
              item.amount === emptyObject.amount
          );

          if (emptyIndex !== -1) {
            // Replace the empty object with the new data
            state.buyAcc[emptyIndex] = data;
          } else {
            // Add the new data to the end of the array
            state.buyAcc.push(data);
          }
          state.buyDayTotalAmt += data.amount;
        }

        if (data?.type === "S") {
          // Find the index of the first empty object in debitAcc
          const emptyIndex = state.sellAcc.findIndex(
            (item) =>
              item.entName === emptyObject.entName &&
              item.amount === emptyObject.amount
          );

          if (emptyIndex !== -1) {
            // Replace the empty object with the new data
            state.sellAcc[emptyIndex] = data;
          } else {
            // Add the new data to the end of the array
            state.sellAcc.push(data);
          }
          state.sellDayTotalAmt += data.amount;
        }
        state.error = null;
      })
      .addCase(undoEntry.rejected, (state, action) => {
        // state.borrowLoading = false;
        state.error = action.payload;
      });
  },
});

export default borrowSliceDetails.reducer;
