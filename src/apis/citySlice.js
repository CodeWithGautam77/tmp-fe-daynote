import { createSlice } from "@reduxjs/toolkit";
import { gujaratCities } from "../common/common";

const initialState = {
  cities: gujaratCities,
};

const citySlice = createSlice({
  name: "citySlice",
  initialState,
  reducers: {
    addUserCities: (state, action) => {
      state.cities = [...state.cities, ...action.payload];
    },
  },
});

export const { addUserCities } = citySlice.actions;

export default citySlice.reducer;
