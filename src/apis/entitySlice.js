import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apisHeaders } from "../common/apisHeaders.js";

// ----------------For addEntity----------------------------\\

export const addEntity = createAsyncThunk(
  "addEntity",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/ent/addentity`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMatchingCreditEntitys = createAsyncThunk(
  "getMatchingCreditEntitys",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/ent/getentity`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMatchingDebitEntitys = createAsyncThunk(
  "getMatchingDebitEntitys",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/ent/getentity`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getEntitysCityCount = createAsyncThunk(
  "getEntitysCityCount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/ent/getEntitysCityCount`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getEntitysByType = createAsyncThunk(
  "getEntitysByType",
  async (data, { rejectWithValue }) => {
    // console.log("data---", data);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/ent/getentitysbytype`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getEntityById = createAsyncThunk(
  "getEntityById",
  async (data, { rejectWithValue }) => {
    // console.log("data---", data);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/ent/getentitybyid`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllEntitysByType = createAsyncThunk(
  "getAllEntitysByType",
  async (data, { rejectWithValue }) => {
    // console.log("data---", data);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/ent/getallentitysbytype`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEntity = createAsyncThunk(
  "updateEntity",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/ent/updateentity`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEntity = createAsyncThunk(
  "deleteEntity",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/ent/deleteentity/${data}`,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addMultipleEntities = createAsyncThunk(
  "addMultipleEntities",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/ent/addmultipleentities`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const entitySliceDetails = createSlice({
  name: "entitySliceDetails",
  initialState: {
    citycount: [],
    citycountLoading: false,
    entitys: [],
    creditEntitys: [],
    debitEntitys: [],
    entityAns: false,
    entLoading: false,
    error: null,
  },
  reducers: {
    addCreditEntity(state, action) {
      state.creditEntitys.unshift(action.payload);
    },
    addDebitEntity(state, action) {
      state.debitEntitys.unshift(action.payload);
    },
    setCreditEntitys(state, action) {
      state.creditEntitys = action.payload;
    },
    setDebitEntitys(state, action) {
      state.debitEntitys = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addEntity.pending, (state) => {
        state.entLoading = true;
        state.error = null;
      })
      .addCase(addEntity.fulfilled, (state, action) => {
        state.entLoading = false;
        state.entitys.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(addEntity.rejected, (state, action) => {
        state.entLoading = false;
        state.error = action.payload;
      })

      .addCase(getMatchingCreditEntitys.pending, (state) => {
        state.entLoading = true;
        state.error = null;
        state.entityAns = false;
      })
      .addCase(getMatchingCreditEntitys.fulfilled, (state, action) => {
        state.entLoading = false;
        state.creditEntitys = action.payload.data;
        state.entityAns = action.payload.perfectAns;
        state.error = null;
      })
      .addCase(getMatchingCreditEntitys.rejected, (state, action) => {
        state.entLoading = false;
        state.error = action.payload;
      })

      .addCase(getMatchingDebitEntitys.pending, (state) => {
        state.entLoading = true;
        state.error = null;
        state.entityAns = false;
      })
      .addCase(getMatchingDebitEntitys.fulfilled, (state, action) => {
        state.entLoading = false;
        state.debitEntitys = action.payload.data;
        state.entityAns = action.payload.perfectAns;
        state.error = null;
      })
      .addCase(getMatchingDebitEntitys.rejected, (state, action) => {
        state.entLoading = false;
        state.error = action.payload;
      })

      .addCase(getEntitysCityCount.pending, (state) => {
        state.citycountLoading = true;
        state.error = null;
      })
      .addCase(getEntitysCityCount.fulfilled, (state, action) => {
        state.citycountLoading = false;
        state.citycount = action.payload.data;
        state.error = null;
      })
      .addCase(getEntitysCityCount.rejected, (state, action) => {
        state.citycountLoading = false;
        state.error = action.payload;
      })

      .addCase(getEntitysByType.pending, (state) => {
        state.entLoading = true;
        state.error = null;
      })
      .addCase(getEntitysByType.fulfilled, (state, action) => {
        state.entLoading = false;
        state.entitys = action.payload.data;
        state.error = null;
      })
      .addCase(getEntitysByType.rejected, (state, action) => {
        state.entLoading = false;
        state.error = action.payload;
      })

      .addCase(getEntityById.pending, (state) => {
        state.entLoading = true;
        state.error = null;
      })
      .addCase(getEntityById.fulfilled, (state, action) => {
        state.entLoading = false;
        state.entitys = action.payload.data;
        state.error = null;
      })
      .addCase(getEntityById.rejected, (state, action) => {
        state.entLoading = false;
        state.error = action.payload;
      })

      .addCase(getAllEntitysByType.pending, (state) => {
        state.entLoading = true;
        state.error = null;
      })
      .addCase(getAllEntitysByType.fulfilled, (state, action) => {
        state.entLoading = false;
        // state.entitys = action.payload.data;
        state.error = null;
      })
      .addCase(getAllEntitysByType.rejected, (state, action) => {
        state.entLoading = false;
        state.error = action.payload;
      })

      .addCase(updateEntity.pending, (state) => {
        state.entLoading = true;
        state.error = null;
      })
      .addCase(updateEntity.fulfilled, (state, action) => {
        state.entLoading = false;
        const { data } = action.payload;
        state.entitys = state.entitys.map((item) =>
          item._id === data._id ? data : item
        );
        state.error = null;
      })
      .addCase(updateEntity.rejected, (state, action) => {
        state.entLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteEntity.pending, (state) => {
        state.entLoading = true;
        state.error = null;
      })
      .addCase(deleteEntity.fulfilled, (state, action) => {
        state.entLoading = false;
        const { data } = action.payload;
        state.entitys = state.entitys.filter((item) => item._id !== data._id);
        state.error = null;
      })
      .addCase(deleteEntity.rejected, (state, action) => {
        state.entLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setDebitEntitys,
  setCreditEntitys,
  addDebitEntity,
  addCreditEntity,
} = entitySliceDetails.actions;

export default entitySliceDetails.reducer;
