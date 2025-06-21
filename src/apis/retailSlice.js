import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apisHeaders } from "../common/apisHeaders.js";
// ----------------For addBorrowEntry----------------------------\\

export const addRetailEntry = createAsyncThunk(
  "addRetailEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/retail/addRetailEntry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addDailyCashTotal = createAsyncThunk(
  "addDailyCashTotal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/retail/addDailyCashTotal`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getRetailEntrysByDate = createAsyncThunk(
  "getRetailEntrysByDate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/retail/getAllRetails`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteRetailEntry = createAsyncThunk(
  "deleteRetailEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/retail/deleteRetailEntry`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateRetailEntry = createAsyncThunk(
  "updateRetailEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/retail/updateRetailEntry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCustomerSupplierEntry = createAsyncThunk(
  "addCustomerSupplierEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/retail/addCustomerSupplierEntry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addForceCustomerSupplierEntry = createAsyncThunk(
  "addForceCustomerSupplierEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/retail/addForceCustomerSupplierEntry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCustomerSupplierEntry = createAsyncThunk(
  "updateCustomerSupplierEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/retail/updateCustomerSupplierEntry`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

function handleIncomeCashAcc(state, accData) {
  const emptyObject = { amount: "" };
  const emptyIndex = state.incomeCashAcc.findIndex(
    (item) => item.amount === emptyObject.amount
  );
  if (emptyIndex !== -1) {
    state.incomeCashAcc[emptyIndex] = accData;
  } else {
    state.incomeCashAcc.push(accData);
  }
  state.incomeCashDayTotalAmt += accData.amount;
}

function handleIncomeOnlineAcc(state, accData, bank) {
  const emptyObject = { amount: "" };
  const emptyIndex = state.incomeOnlineAcc.findIndex(
    (item) => item.amount === emptyObject.amount
  );
  if (emptyIndex !== -1) {
    state.incomeOnlineAcc[emptyIndex] = accData;
  } else {
    state.incomeOnlineAcc.push(accData);
  }
  state.incomeOnlineDayTotalAmt += accData.amount;
  state.bankData = bank;
}

function handleExpenseAcc(state, accData, bank) {
  const emptyObject = { amount: "" };
  const emptyIndex = state.expenseCashAcc.findIndex(
    (item) => item.amount === emptyObject.amount
  );
  if (emptyIndex !== -1) {
    state.expenseCashAcc[emptyIndex] = accData;
  } else {
    state.expenseCashAcc.push(accData);
  }
  if (accData.type === "C") {
    state.expenseCashDayTotalAmt += accData.amount;
  }
  if (accData.type === "O") {
    state.expenseOnlineDayTotalAmt += accData.amount;
    state.bankData = bank;
  }
  if (accData.type === "K") {
    state.expenseCardDayTotalAmt += accData.amount;
  }
}

function updateIncomeCashAcc(state, data) {
  state.incomeCashAcc = state.incomeCashAcc.map((item) =>
    data._id === item._id ? { ...item, ...data } : item
  );
  state.incomeCashDayTotalAmt = state.incomeCashAcc.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );
}

function updateIncomeOnlineAcc(state, data) {
  state.incomeOnlineAcc = state.incomeOnlineAcc.map((item) =>
    data._id === item._id ? { ...item, ...data } : item
  );
  state.incomeOnlineDayTotalAmt = state.incomeOnlineAcc.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );
}

function updateExpenseAcc(state, data) {
  state.expenseCashAcc = state.expenseCashAcc.map((item) =>
    data._id === item._id ? { ...item, ...data } : item
  );
  if (data.type === "C") {
    state.expenseCashDayTotalAmt = state.expenseCashAcc
      .filter((item) => item.type === "C")
      .reduce((total, item) => total + Number(item.amount || 0), 0);
  }
  if (data.type === "O") {
    state.expenseOnlineDayTotalAmt = state.expenseCashAcc
      .filter((item) => item.type === "O")
      .reduce((total, item) => total + Number(item.amount || 0), 0);
  }
  if (data.type === "K") {
    state.expenseCardDayTotalAmt = state.expenseCashAcc
      .filter((item) => item.type === "K")
      .reduce((total, item) => total + Number(item.amount || 0), 0);
  }
}

export const retailSliceDetails = createSlice({
  name: "retailSliceDetails",
  initialState: {
    incomeCashAcc: [],
    incomeOnlineAcc: [],
    expenseCashAcc: [],
    expenseOnlineAcc: [],
    expenseCardAcc: [],
    retailLoading: false,
    incomeCashDayTotalAmt: 0,
    incomeOnlineDayTotalAmt: 0,
    expenseDayTotalAmt: 0,
    expenseCashDayTotalAmt: 0,
    expenseOnlineDayTotalAmt: 0,
    expenseCardDayTotalAmt: 0,
    previousCashEntry: null,
    todayCashEntry: null,
    bankData: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRetailEntry.pending, (state) => {
        state.error = null;
      })
      .addCase(addRetailEntry.fulfilled, (state, action) => {
        state.retailLoading = false;
        const { accData, bank } = action.payload.data;
        if (accData.iType === "I" && accData.type === "C") {
          handleIncomeCashAcc(state, accData);
        }

        if (accData.iType === "I" && accData.type === "O") {
          handleIncomeOnlineAcc(state, accData, bank);
        }

        if (accData.iType === "E") {
          handleExpenseAcc(state, accData, bank);
        }
        // if (accData.iType === "I" && accData.type === "C") {
        //   const emptyIndex = state.incomeCashAcc.findIndex(
        //     (item) => item.amount === emptyObject.amount
        //   );

        //   if (emptyIndex !== -1) {
        //     state.incomeCashAcc[emptyIndex] = accData;
        //   } else {
        //     state.incomeCashAcc.push(accData);
        //   }
        //   state.incomeCashDayTotalAmt += accData.amount;
        // }

        // if (accData.iType === "I" && accData.type === "O") {
        //   const emptyIndex = state.incomeOnlineAcc.findIndex(
        //     (item) => item.amount === emptyObject.amount
        //   );

        //   if (emptyIndex !== -1) {
        //     state.incomeOnlineAcc[emptyIndex] = accData;
        //   } else {
        //     state.incomeOnlineAcc.push(accData);
        //   }
        //   state.incomeOnlineDayTotalAmt += accData.amount;
        //   state.bankData = bank;
        // }

        // if (accData.iType === "E") {
        //   const emptyIndex = state.expenseCashAcc.findIndex(
        //     (item) => item.amount === emptyObject.amount
        //   );

        //   if (emptyIndex !== -1) {
        //     state.expenseCashAcc[emptyIndex] = accData;
        //   } else {
        //     state.expenseCashAcc.push(accData);
        //   }

        //   if (accData.type === "C") {
        //     state.expenseCashDayTotalAmt += accData.amount;
        //   }
        //   if (accData.type === "O") {
        //     state.expenseOnlineDayTotalAmt += accData.amount;
        //     state.bankData = bank;
        //   }
        //   if (accData.type === "K") {
        //     state.expenseCardDayTotalAmt += accData.amount;
        //   }
        // }
        state.error = null;
      })
      .addCase(addRetailEntry.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getRetailEntrysByDate.pending, (state) => {
        state.retailLoading = true;
        state.error = null;
      })
      .addCase(getRetailEntrysByDate.fulfilled, (state, action) => {
        state.retailLoading = false;
        const { data } = action.payload;
        state.incomeCashAcc = data?.incomeCashData;
        state.incomeOnlineAcc = data?.incomeOnlineData;
        state.expenseCashAcc = data?.expenseData;
        state.incomeCashDayTotalAmt = data?.incomeCashTotal;
        state.incomeOnlineDayTotalAmt = data?.incomeOnlineTotal;
        state.expenseCashDayTotalAmt = data?.expenseCashTotal;
        state.expenseOnlineDayTotalAmt = data?.expenseOnlineTotal;
        state.expenseCardDayTotalAmt = data?.expenseCardTotal;
        state.todayCashEntry = data?.today_cashEntry;
        state.previousCashEntry = data?.previous_cashEntry;
        state.bankData = data?.bank;
        state.error = null;
      })
      .addCase(getRetailEntrysByDate.rejected, (state, action) => {
        state.retailLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteRetailEntry.pending, (state) => {
        state.retailLoading = true;
        state.error = null;
      })
      .addCase(deleteRetailEntry.fulfilled, (state, action) => {
        state.retailLoading = false;
        const { accData, bank } = action.payload.data;
        if (accData.iType === "I" && accData.type === "C") {
          state.incomeCashAcc = state.incomeCashAcc.filter(
            (item) => item._id !== accData._id
          );
          state.incomeCashDayTotalAmt -= accData.amount;
          state.incomeCashAcc.push({ amount: "" });
        }
        if (accData.iType === "I" && accData.type === "O") {
          state.incomeOnlineAcc = state.incomeOnlineAcc.filter(
            (item) => item._id !== accData._id
          );
          state.incomeOnlineDayTotalAmt -= accData.amount;
          state.incomeOnlineAcc.push({ amount: "" });
        }

        if (accData.iType === "E") {
          state.expenseCashAcc = state.expenseCashAcc.filter(
            (item) => item._id !== accData._id
          );
          state.expenseCashDayTotalAmt -= accData.amount;
          state.expenseCashAcc.push({ amount: "" });
        }
        if (accData.type === "O") {
          state.bankData = bank;
        }
        state.error = null;
      })
      .addCase(deleteRetailEntry.rejected, (state, action) => {
        state.retailLoading = false;
        state.error = action.payload;
      })

      .addCase(updateRetailEntry.pending, (state) => {
        state.error = null;
      })
      .addCase(updateRetailEntry.fulfilled, (state, action) => {
        state.retailLoading = false;
        const { data } = action.payload;

        if (data?.iType === "I" && data?.type === "C") {
          updateIncomeCashAcc(state, data);
        }

        if (data?.iType === "I" && data?.type === "O") {
          updateIncomeOnlineAcc(state, data);
        }

        if (data?.iType === "E") {
          updateExpenseAcc(state, data);
        }

        state.error = null;
      })
      .addCase(updateRetailEntry.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(addCustomerSupplierEntry.pending, (state) => {
        state.error = null;
      })
      .addCase(addCustomerSupplierEntry.fulfilled, (state, action) => {
        state.retailLoading = false;
        const { accData, bank } = action.payload.data;
        if (accData.iType === "I" && accData.type === "C") {
          handleIncomeCashAcc(state, accData);
        }

        if (accData.iType === "I" && accData.type === "O") {
          handleIncomeOnlineAcc(state, accData, bank);
        }

        if (accData.iType === "E") {
          handleExpenseAcc(state, accData, bank);
        }
        state.error = null;
      })
      .addCase(addCustomerSupplierEntry.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(addForceCustomerSupplierEntry.pending, (state) => {
        state.error = null;
      })
      .addCase(addForceCustomerSupplierEntry.fulfilled, (state, action) => {
        state.retailLoading = false;
        const { accData, bank } = action.payload.data;
        if (accData.iType === "I" && accData.type === "C") {
          handleIncomeCashAcc(state, accData);
        }

        if (accData.iType === "I" && accData.type === "O") {
          handleIncomeOnlineAcc(state, accData, bank);
        }

        if (accData.iType === "E") {
          handleExpenseAcc(state, accData, bank);
        }
        state.error = null;
      })
      .addCase(addForceCustomerSupplierEntry.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateCustomerSupplierEntry.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCustomerSupplierEntry.fulfilled, (state, action) => {
        state.retailLoading = false;
        const { data } = action.payload;

        if (data?.iType === "I" && data?.type === "C") {
          updateIncomeCashAcc(state, data);
        }

        if (data?.iType === "I" && data?.type === "O") {
          updateIncomeOnlineAcc(state, data);
        }

        if (data?.iType === "E") {
          updateExpenseAcc(state, data);
        }

        state.error = null;
      })
      .addCase(updateCustomerSupplierEntry.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(addDailyCashTotal.pending, (state) => {
        // state.retailLoading = true;
        state.error = null;
      })
      .addCase(addDailyCashTotal.fulfilled, (state, action) => {
        state.retailLoading = false;
        state.todayCashEntry = action.payload.data;
        state.error = null;
      })
      .addCase(addDailyCashTotal.rejected, (state, action) => {
        // state.retailLoading = false;
        state.error = action.payload;
      });
  },
});

export default retailSliceDetails.reducer;
