import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apisHeaders } from "../common/apisHeaders.js";

// ----------------For addTeam----------------------------\\

export const addTeam = createAsyncThunk(
  "addTeam",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/team/addmember`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTeam = createAsyncThunk(
  "getTeam",
  async (data, { rejectWithValue }) => {
    // console.log("data---", data);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/team/getteam`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMemberById = createAsyncThunk(
  "getMemberById",
  async (data, { rejectWithValue }) => {
    // console.log("data---", data);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/team/getmemberbyid`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTeam = createAsyncThunk(
  "updateTeam",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/team/updatemember`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTeam = createAsyncThunk(
  "deleteTeam",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/team/deletemember`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchMember = createAsyncThunk(
  "searchMember",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/team/searchMember`,
        data,
        apisHeaders
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const teamSliceDetails = createSlice({
  name: "teamSliceDetails",
  initialState: {
    team: [],
    teamLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTeam.pending, (state) => {
        state.teamLoading = true;
        state.error = null;
      })
      .addCase(addTeam.fulfilled, (state, action) => {
        state.teamLoading = false;
        state.team.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(addTeam.rejected, (state, action) => {
        state.teamLoading = false;
        state.error = action.payload;
      })

      .addCase(getTeam.pending, (state) => {
        state.teamLoading = true;
        state.error = null;
      })
      .addCase(getTeam.fulfilled, (state, action) => {
        state.teamLoading = false;
        state.team = action.payload.data;
        state.error = null;
      })
      .addCase(getTeam.rejected, (state, action) => {
        state.teamLoading = false;
        state.error = action.payload;
      })

      .addCase(getMemberById.pending, (state) => {
        state.teamLoading = true;
        state.error = null;
      })
      .addCase(getMemberById.fulfilled, (state, action) => {
        state.teamLoading = false;
        state.team = action.payload.data;
        state.error = null;
      })
      .addCase(getMemberById.rejected, (state, action) => {
        state.teamLoading = false;
        state.error = action.payload;
      })

      .addCase(updateTeam.pending, (state) => {
        state.teamLoading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.teamLoading = false;
        const { data } = action.payload;
        state.team = state.team.map((item) =>
          item._id === data._id ? data : item
        );
        state.error = null;
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.teamLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteTeam.pending, (state) => {
        state.teamLoading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teamLoading = false;
        const { data } = action.payload;
        state.team = state.team.filter((item) => item._id !== data._id);
        state.error = null;
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.teamLoading = false;
        state.error = action.payload;
      })

      .addCase(searchMember.pending, (state) => {
        state.teamLoading = true;
        state.error = null;
      })
      .addCase(searchMember.fulfilled, (state, action) => {
        state.teamLoading = false;
        state.error = null;
      })
      .addCase(searchMember.rejected, (state, action) => {
        state.teamLoading = false;
        state.error = action.payload;
      });
  },
});

// export const { setDebitTeams, setCreditTeams } = teamSliceDetails.actions;

export default teamSliceDetails.reducer;
