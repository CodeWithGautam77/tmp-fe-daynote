import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apisHeaders } from "../common/apisHeaders.js";

export const addNameNumber = createAsyncThunk(
  "addNameNumber",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/phonebook/addNameNumber`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPhoneBook = createAsyncThunk(
  "getPhoneBook",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/phonebook/getPhoneBook`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToFav = createAsyncThunk(
  "addToFav",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/phonebook/addToFav`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const phoneBookSliceDetails = createSlice({
  name: "phoneBookSliceDetails",
  initialState: {
    phonebook: [],
    pbookLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPhoneBook.pending, (state) => {
        state.pbookLoading = true;
        state.error = null;
      })
      .addCase(getPhoneBook.fulfilled, (state, action) => {
        state.pbookLoading = false;
        // console.log(action.payload.data)
        state.phonebook = action.payload.data;
        state.error = null;
      })
      .addCase(getPhoneBook.rejected, (state, action) => {
        state.pbookLoading = false;
        state.error = action.payload;
      })

      .addCase(addNameNumber.pending, (state) => {
        state.pbookLoading = true;
        state.error = null;
      })
      .addCase(addNameNumber.fulfilled, (state, action) => {
        state.pbookLoading = false;
        // console.log(action.payload.data)
        state.phonebook.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(addNameNumber.rejected, (state, action) => {
        state.pbookLoading = false;
        state.error = action.payload;
      })

      .addCase(addToFav.pending, (state) => {
        state.pbookLoading = true;
        state.error = null;
      })
      .addCase(addToFav.fulfilled, (state, action) => {
        state.pbookLoading = false;
        const { data } = action.payload;
        state.phonebook = state.phonebook.filter(
          (item) => item._id !== data._id
        );
        state.phonebook.unshift(data);
        state.error = null;
      })
      .addCase(addToFav.rejected, (state, action) => {
        state.pbookLoading = false;
        state.error = action.payload;
      });
  },
});

export default phoneBookSliceDetails.reducer;
