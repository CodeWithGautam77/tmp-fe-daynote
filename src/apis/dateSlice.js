import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  currentDate: moment().format(),
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    nextDate: (state) => {
      state.currentDate = moment(state.currentDate).add(1, "days").format();
    },
    previousDate: (state) => {
      state.currentDate = moment(state.currentDate)
        .subtract(1, "days")
        .format();
    },
    setDate: (state, action) => {
      state.currentDate = action.payload;
    },
  },
});

export const { nextDate, previousDate, setDate } = dateSlice.actions;

export default dateSlice.reducer;
