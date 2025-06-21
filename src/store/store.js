import { configureStore } from "@reduxjs/toolkit";
import authSliceDetails from "../apis/authSlice";
import dateSlice from "../apis/dateSlice";
import entitySliceDetails from "../apis/entitySlice";
import teamSliceDetails from "../apis/teamSlice";
import mainSliceDetails from "../apis/mainSlice";
import borrowSliceDetails from "../apis/borrowSlice";
import longtermBorrowSlice from "../apis/longtermBorrowSlice";
import historySliceDetails from "../apis/historySlice";
import retailSlice from "../apis/retailSlice";
import phoneBookSliceDetails from "../apis/phoneBookSlice";
import citySlice from "../apis/citySlice";
import tempLongtermLedgerDetails from "../apis/tempLongtermLedger";
import noteSlice from "../apis/noteSlice";
import userSliceDetails from "../apis/userSlice";

export const store = configureStore({
  reducer: {
    date: dateSlice,
    citiesData: citySlice,
    authData: authSliceDetails,
    entData: entitySliceDetails,
    teamData: teamSliceDetails,
    mainData: mainSliceDetails,
    borrowData: borrowSliceDetails,
    longtermBorrowData: longtermBorrowSlice,
    retailData: retailSlice,
    historyData: historySliceDetails,
    pBookData: phoneBookSliceDetails,
    tempLongtermLedgerData: tempLongtermLedgerDetails,
    noteData: noteSlice,
    userData: userSliceDetails,
  },
});
