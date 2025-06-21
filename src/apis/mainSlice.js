import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apisHeaders } from "../common/apisHeaders.js";
import { insertEntryInOrder } from "../common/common.js";

// ----------------For addMainEntry----------------------------\\

export const addMainEntry = createAsyncThunk(
  "addMainEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/addmainentry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addForceMainEntry = createAsyncThunk(
  "addForceMainEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/addForceMainEntry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addBankAngadiaAccEntry = createAsyncThunk(
  "addBankAngadiaAccEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/baentry/addBankAngadiaAccEntry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCreditBAEntry = createAsyncThunk(
  "addCreditBAEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/baentry/addCreditBAEntry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCashCreditBAEntry = createAsyncThunk(
  "addCashCreditBAEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/baentry/addCashCreditBAEntry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTempBorrowEntry = createAsyncThunk(
  "addTempBorrowEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/addtempborrowentry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addMainCashDayTotal = createAsyncThunk(
  "addMainCashDayTotal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/addMainCashDayTotal`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMainEntrysByDate = createAsyncThunk(
  "getMainEntrysByDate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/getallmains`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBAEntrysByDate = createAsyncThunk(
  "getBAEntrysByDate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/baentry/getAllBankAngadiaAcc`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTempBorrowEntrys = createAsyncThunk(
  "getTempBorrowEntrys",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/getalltempborrow`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEntry = createAsyncThunk(
  "deleteEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/deleteentry`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateMainEntry = createAsyncThunk(
  "updateMainEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/updateMainEntry`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTempBorrowEntry = createAsyncThunk(
  "updateTempBorrowEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/updateTempBorrowEntry`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTempBorrowEntry = createAsyncThunk(
  "deleteTempBorrowEntry",
  async (data, { rejectWithValue }) => {
    // console.log(data);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/deleteTempBorrowEntry`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBankAngadiaAccEntry = createAsyncThunk(
  "deleteBankAngadiaAccEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/baentry/deleteBankAngadiaAccEntry`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCashBAEntry = createAsyncThunk(
  "deleteCashBAEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/main/baentry/deleteCashBAEntry`,
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
        `${process.env.REACT_APP_BACKEND_API}/main/undoEntry`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const mainSliceDetails = createSlice({
  name: "mainSliceDetails",
  initialState: {
    creditAcc: [],
    debitAcc: [],
    tempBorrow: [],
    allMainEntrys: [],
    baEntrys: [],
    baLoading: false,
    mainscreenLoading: false,
    cashEntryLoading: false,
    dayTotalAmt: 0,
    prevDayTotalAmt: 0,
    overAllTotalAmt: 0,
    creditDayTotalAmt: 0,
    debitDayTotalAmt: 0,
    tempBorrowTotalAmt: 0,
    error: null,
  },
  reducers: {
    updateTempBorrow: (state, action) => {
      const newObj = action.payload;
      // const index = state.tempBorrow.map((item) => item._id === newObj._id);
      state.tempBorrow = state.tempBorrow.map((item) =>
        item._id === newObj._id ? { ...item, amount: newObj.amount } : item
      );
      state.tempBorrowTotalAmt += newObj.amount;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMainEntry.pending, (state) => {
        // state.mainscreenLoading = true;
        state.error = null;
      })
      .addCase(addMainEntry.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        const { data } = action.payload;
        if (data?.type === "C") {
          const order = ["CT", "MR", "M", "C", "P", "R", "SE", "B", "A"];
          insertEntryInOrder(state.creditAcc, data, order);
          if (data.etype !== "MR" && data.etype !== "R") {
            state.creditDayTotalAmt += data.amount;
          }
        }

        if (data?.type === "D") {
          const order = ["MR", "M", "S", "P", "R", "SE", "B", "A"];
          insertEntryInOrder(state.debitAcc, data, order);
          if (data.etype !== "MR" && data.etype !== "R") {
            state.debitDayTotalAmt += data.amount;
          }
        }

        if (data?.type === "T") {
          const order = ["T"];
          insertEntryInOrder(state.tempBorrow, data, order);
          state.tempBorrowTotalAmt += data.amount;
        }
        state.error = null;
      })
      .addCase(addMainEntry.rejected, (state, action) => {
        // state.mainscreenLoading = false;
        state.error = action.payload;
      })

      .addCase(addForceMainEntry.pending, (state) => {
        state.error = null;
      })
      .addCase(addForceMainEntry.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        const { data } = action.payload;
        if (data) {
          if (data?.type === "C") {
            const order = ["CT", "MR", "M", "C", "P", "R", "B", "A"];
            insertEntryInOrder(state.creditAcc, data, order);
            if (data.etype !== "MR") {
              state.creditDayTotalAmt += data.amount;
            }
          }

          if (data?.type === "D") {
            const order = ["MR", "M", "S", "P", "R", "B", "A"];
            insertEntryInOrder(state.debitAcc, data, order);
            if (data.etype !== "MR") {
              state.debitDayTotalAmt += data.amount;
            }
          }
        }
        state.error = null;
      })
      .addCase(addForceMainEntry.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(addBankAngadiaAccEntry.pending, (state) => {
        state.error = null;
      })
      .addCase(addBankAngadiaAccEntry.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        const { data } = action.payload;
        state.debitAcc = state.debitAcc.map((item) =>
          item._id === data.updateBAEntry._id
            ? { ...item, amount: data.updateBAEntry.amount }
            : item
        );
        state.error = null;
      })
      .addCase(addBankAngadiaAccEntry.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(addCreditBAEntry.pending, (state) => {
        state.error = null;
      })
      .addCase(addCreditBAEntry.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        const { accData, updateBAEntry } = action.payload.data;
        if (accData?.type === "D") {
          const order = ["MR", "M", "S", "P", "R", "SE", "B", "A"];
          insertEntryInOrder(state.debitAcc, accData, order);
          if (accData.etype !== "MR") {
            state.debitDayTotalAmt += accData.amount;
          }
          state.creditAcc = state.creditAcc.map((item) =>
            item._id === updateBAEntry._id
              ? { ...item, amount: updateBAEntry.amount }
              : item
          );
        }
        if (accData?.type === "C") {
          const order = ["CT", "MR", "M", "C", "P", "R", "B", "A"];
          insertEntryInOrder(state.creditAcc, accData, order);
          if (accData.etype !== "MR") {
            state.creditDayTotalAmt += accData.amount;
          }
          state.debitAcc = state.debitAcc.map((item) =>
            item._id === updateBAEntry._id
              ? { ...item, amount: updateBAEntry.amount }
              : item
          );
        }
        state.error = null;
      })
      .addCase(addCreditBAEntry.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(addCashCreditBAEntry.pending, (state) => {
        state.error = null;
      })
      .addCase(addCashCreditBAEntry.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        const { accData, updateBAEntry } = action.payload.data;
        if (accData?.type === "D") {
          const order = ["MR", "M", "S", "P", "R", "SE", "B", "A"];
          insertEntryInOrder(state.debitAcc, accData, order);
          if (accData.etype !== "MR") {
            state.debitDayTotalAmt += accData.amount;
          }
          state.creditAcc = state.creditAcc.map((item) =>
            item._id === updateBAEntry._id
              ? { ...item, amount: updateBAEntry.amount }
              : item
          );
        }
        if (accData?.type === "C") {
          const order = ["CT", "MR", "M", "C", "P", "R", "B", "A"];
          insertEntryInOrder(state.creditAcc, accData, order);
          if (accData.etype !== "MR") {
            state.creditDayTotalAmt += accData.amount;
          }
          state.debitAcc = state.debitAcc.map((item) =>
            item._id === updateBAEntry._id
              ? { ...item, amount: updateBAEntry.amount }
              : item
          );
        }
        state.error = null;
      })
      .addCase(addCashCreditBAEntry.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(addTempBorrowEntry.pending, (state) => {
        // state.mainscreenLoading = true;
        state.error = null;
      })
      .addCase(addTempBorrowEntry.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        // console.log(action.payload)
        const { data } = action.payload;
        const order = ["T"];
        insertEntryInOrder(state.tempBorrow, data, order);
        state.tempBorrowTotalAmt += data.amount;
        state.error = null;
      })
      .addCase(addTempBorrowEntry.rejected, (state, action) => {
        // state.mainscreenLoading = false;
        state.error = action.payload;
      })

      .addCase(addMainCashDayTotal.pending, (state) => {
        state.cashEntryLoading = true;
        state.error = null;
      })
      .addCase(addMainCashDayTotal.fulfilled, (state, action) => {
        state.cashEntryLoading = false;
        const { data } = action.payload;
        // console.log("data", data);
        const order = ["MR", "M", "S", "P", "R", "CT", "SE", "B", "A"];
        insertEntryInOrder(state.debitAcc, data, order);
        // state.debitDayTotalAmt += Number(data.amount);
        state.error = null;
      })
      .addCase(addMainCashDayTotal.rejected, (state, action) => {
        state.cashEntryLoading = false;
        state.error = action.payload;
      })

      .addCase(getTempBorrowEntrys.pending, (state) => {
        state.mainscreenLoading = true;
        state.error = null;
      })
      .addCase(getTempBorrowEntrys.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        state.tempBorrow = action.payload?.data?.tmpBorrowData;
        state.tempBorrowTotalAmt = action.payload?.data?.tmpBorrowTotal;
        state.error = null;
      })
      .addCase(getTempBorrowEntrys.rejected, (state, action) => {
        state.mainscreenLoading = false;
        state.error = action.payload;
      })

      .addCase(getMainEntrysByDate.pending, (state) => {
        state.mainscreenLoading = true;
        state.error = null;
      })
      .addCase(getMainEntrysByDate.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        // console.log(action.payload.data)
        state.creditAcc = action.payload?.data?.creditData;
        state.debitAcc = action.payload?.data?.debitData;
        state.creditDayTotalAmt = action.payload?.data?.creditTotal;
        state.debitDayTotalAmt = action.payload?.data?.debitTotal;
        state.error = null;
      })
      .addCase(getMainEntrysByDate.rejected, (state, action) => {
        state.mainscreenLoading = false;
        state.error = action.payload;
      })

      .addCase(getBAEntrysByDate.pending, (state) => {
        state.baLoading = true;
        state.error = null;
      })
      .addCase(getBAEntrysByDate.fulfilled, (state, action) => {
        state.baLoading = false;
        state.baEntrys = action.payload?.data;
        state.error = null;
      })
      .addCase(getBAEntrysByDate.rejected, (state, action) => {
        state.baLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteEntry.pending, (state) => {
        state.mainscreenLoading = true;
        state.error = null;
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        const { updateMainEntryData, baMainData } = action.payload.data;
        if (updateMainEntryData.type === "C") {
          state.creditAcc = state.creditAcc.filter(
            (item) => item._id !== updateMainEntryData._id
          );
          if (updateMainEntryData.etype !== "MR") {
            state.creditDayTotalAmt -= updateMainEntryData.amount;
          }
        }
        if (updateMainEntryData.type === "D") {
          state.debitAcc = state.debitAcc.filter(
            (item) => item._id !== updateMainEntryData._id
          );
          if (updateMainEntryData.etype !== "MR") {
            state.debitDayTotalAmt -= updateMainEntryData.amount;
          }
        }
        if (baMainData) {
          if (baMainData?.type === "C") {
            state.creditAcc = state.creditAcc.map((item) =>
              item._id === baMainData?._id
                ? { ...item, amount: baMainData?.amount }
                : item
            );
          }
          if (baMainData?.type === "D") {
            state.debitAcc = state.debitAcc.map((item) =>
              item._id === baMainData?._id
                ? { ...item, amount: baMainData?.amount }
                : item
            );
          }
        }

        state.error = null;
      })
      .addCase(deleteEntry.rejected, (state, action) => {
        state.mainscreenLoading = false;
        state.error = action.payload;
      })

      .addCase(updateMainEntry.pending, (state) => {
        state.mainscreenLoading = true;
        state.error = null;
      })
      .addCase(updateMainEntry.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        const { data } = action.payload;
        if (data?.type === "C") {
          state.creditAcc = state.creditAcc.map((item) =>
            item._id === data._id ? data : item
          );
        }
        if (data?.type === "D") {
          state.debitAcc = state.debitAcc.map((item) =>
            item._id === data._id ? data : item
          );
        }
        state.error = null;
      })
      .addCase(updateMainEntry.rejected, (state, action) => {
        state.mainscreenLoading = false;
        state.error = action.payload;
      })

      .addCase(updateTempBorrowEntry.pending, (state) => {
        state.mainscreenLoading = true;
        state.error = null;
      })
      .addCase(updateTempBorrowEntry.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        const { data } = action.payload;
        state.tempBorrow = state.tempBorrow.map((item) =>
          item._id === data._id ? data : item
        );
        state.error = null;
      })
      .addCase(updateTempBorrowEntry.rejected, (state, action) => {
        state.mainscreenLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteTempBorrowEntry.pending, (state) => {
        state.mainscreenLoading = true;
        state.error = null;
      })
      .addCase(deleteTempBorrowEntry.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        const { data } = action.payload;
        state.tempBorrow = state.tempBorrow.filter(
          (item) => item._id !== data._id
        );
        state.tempBorrowTotalAmt -= data.amount;
        state.tempBorrow.push({ entName: "", amount: "" });
        state.error = null;
      })
      .addCase(deleteTempBorrowEntry.rejected, (state, action) => {
        state.mainscreenLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteBankAngadiaAccEntry.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteBankAngadiaAccEntry.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        const { data } = action.payload;
        state.debitAcc = state.debitAcc.map((item) =>
          item._id === data.updateBAEntry._id
            ? { ...item, amount: data.updateBAEntry.amount }
            : item
        );
        state.baEntrys = state.baEntrys.filter(
          (item) => item._id !== data.updateMainEntryData._id
        );
        state.error = null;
      })
      .addCase(deleteBankAngadiaAccEntry.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteCashBAEntry.pending, (state) => {
        state.mainscreenLoading = true;
        state.error = null;
      })
      .addCase(deleteCashBAEntry.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        const { updateMainEntryData } = action.payload.data;
        if (updateMainEntryData.type === "C") {
          state.creditAcc = state.creditAcc.filter(
            (item) => item._id !== updateMainEntryData._id
          );
          if (updateMainEntryData.etype !== "MR") {
            state.creditDayTotalAmt -= updateMainEntryData.amount;
          }
        }
        if (updateMainEntryData.type === "D") {
          state.debitAcc = state.debitAcc.filter(
            (item) => item._id !== updateMainEntryData._id
          );
          if (updateMainEntryData.etype !== "MR") {
            state.debitDayTotalAmt -= updateMainEntryData.amount;
          }
        }

        state.error = null;
      })
      .addCase(deleteCashBAEntry.rejected, (state, action) => {
        state.mainscreenLoading = false;
        state.error = action.payload;
      })

      .addCase(undoEntry.pending, (state) => {
        state.mainscreenLoading = true;
        state.error = null;
      })
      .addCase(undoEntry.fulfilled, (state, action) => {
        state.mainscreenLoading = false;
        const { undoData, baMainData } = action.payload.data;
        // console.log("data -->", data);
        if (undoData?.type === "C") {
          const order = ["CT", "MR", "M", "C", "P", "R", "SE", "B", "A"];
          insertEntryInOrder(state.creditAcc, undoData, order);
          if (undoData.etype !== "MR") {
            state.creditDayTotalAmt += undoData.amount;
          }
        }

        if (undoData?.type === "D") {
          const order = ["MR", "M", "S", "P", "R", "SE", "B", "A"];
          insertEntryInOrder(state.debitAcc, undoData, order);
          if (undoData.etype !== "MR") {
            state.debitDayTotalAmt += undoData.amount;
          }
          if (baMainData) {
            if (baMainData?.type === "C") {
              state.creditAcc = state.creditAcc.map((item) =>
                item._id === baMainData?._id
                  ? { ...item, amount: baMainData?.amount }
                  : item
              );
            }
          }
        }

        if (undoData?.type === "T") {
          const order = ["T"];
          insertEntryInOrder(state.tempBorrow, undoData, order);
          state.tempBorrowTotalAmt += undoData.amount;
        }

        state.error = null;
      })
      .addCase(undoEntry.rejected, (state, action) => {
        state.mainscreenLoading = false;
        state.error = action.payload;
      });
  },
});
export const { updateTempBorrow } = mainSliceDetails.actions;
export default mainSliceDetails.reducer;
