import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apisHeaders } from "../common/apisHeaders.js";

// ----------------For createNote----------------------------\\
export const createNote = createAsyncThunk(
  "createNote",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/note/createNote`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ----------------For getAllNotes----------------------------\\
export const getAllNotes = createAsyncThunk(
  "getAllNotes",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/note/getAllNotes`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ----------------For updateNote----------------------------\\
export const updateNote = createAsyncThunk(
  "updateNote",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/note/updateNote`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ----------------For deleteNote----------------------------\\
export const deleteNote = createAsyncThunk(
  "deleteNote",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/note/deleteNote`,
        data,
        apisHeaders
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const noteSlice = createSlice({
  name: "noteSlice",
  initialState: {
    notes: [],
    notesLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNote.pending, (state) => {
        state.notesLoading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.notesLoading = false;
        state.notes.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.notesLoading = false;
        state.error = action.payload;
      })

      .addCase(getAllNotes.pending, (state) => {
        state.notesLoading = true;
        state.error = null;
      })
      .addCase(getAllNotes.fulfilled, (state, action) => {
        state.notesLoading = false;
        state.notes = action.payload?.data;
        state.error = null;
      })
      .addCase(getAllNotes.rejected, (state, action) => {
        state.notesLoading = false;
        state.error = action.payload;
      })

      .addCase(updateNote.pending, (state) => {
        state.notesLoading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.notesLoading = false;
        const { data } = action.payload;
        state.notes = state.notes.map((item) =>
          item._id === data._id ? data : item
        );
        state.error = null;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.notesLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteNote.pending, (state) => {
        state.notesLoading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notesLoading = false;
        const { data } = action.payload;
        state.notes = state.notes.filter((item) => item._id !== data._id);
        state.error = null;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.notesLoading = false;
        state.error = action.payload;
      });
  },
});

export default noteSlice.reducer;
