import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { enUS } from "date-fns/locale";
import Popover from "@mui/material/Popover";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  addYears,
  subYears,
  startOfYear,
  endOfYear,
  subQuarters,
  startOfQuarter,
  endOfQuarter,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
  subWeeks,
  subDays,
} from "date-fns";

const CommanDateRangePicker = ({ fromDate, toDate, onChange }) => {
  const [state, setState] = useState([
    {
      startDate: fromDate,
      endDate: toDate,
      key: "selection",
    },
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectCount, setSelectCount] = useState(0);

  const handleSelect = (ranges) => {
    setState([ranges.selection]);
    onChange(ranges.selection);
    setSelectCount((prev) => {
      const next = prev + 1;
      if (next >= 2) {
        setAnchorEl(null); // Close popover after 2 selections
        return 0; // Reset count
      }
      return next;
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const staticRanges = [
    {
      label: "Today",
      range: () => ({
        startDate: new Date(),
        endDate: new Date(),
      }),
      isSelected: () => false,
    },
    {
      label: "Yesterday",
      range: () => ({
        startDate: subDays(new Date(), 1),
        endDate: subDays(new Date(), 1),
      }),
      isSelected: () => false,
    },
    {
      label: "This Week",
      range: () => ({
        startDate: startOfWeek(new Date()),
        endDate: endOfWeek(new Date()),
      }),
      isSelected: () => false,
    },
    {
      label: "Last Week",
      range: () => ({
        startDate: startOfWeek(subWeeks(new Date(), 1)),
        endDate: endOfWeek(subWeeks(new Date(), 1)),
      }),
      isSelected: () => false,
    },
    {
      label: "This Month",
      range: () => ({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      }),
      isSelected: () => false,
    },
    {
      label: "Last Month",
      range: () => ({
        startDate: startOfMonth(subMonths(new Date(), 1)),
        endDate: endOfMonth(subMonths(new Date(), 1)),
      }),
      isSelected: () => false,
    },
    {
      label: "This Quarter",
      range: () => ({
        startDate: startOfQuarter(new Date()),
        endDate: endOfQuarter(new Date()),
      }),
      isSelected: () => false,
    },
    {
      label: "Last Quarter",
      range: () => ({
        startDate: startOfQuarter(subQuarters(new Date(), 1)),
        endDate: endOfQuarter(subQuarters(new Date(), 1)),
      }),
      isSelected: () => false,
    },
    {
      label: "Current Year",
      range: () => ({
        startDate: startOfYear(new Date()),
        endDate: endOfYear(new Date()),
      }),
      isSelected: () => false,
    },
    {
      label: "Prev Year",
      range: () => ({
        startDate: startOfYear(subYears(new Date(), 1)),
        endDate: endOfYear(subYears(new Date(), 1)),
      }),
      isSelected: () => false,
    },
  ];
  
  return (
    <div>
      <div
        onClick={handleClick}
        className="flex gap-05"
        style={{
          border: "1px solid #1f1c1c",
          padding: ".3rem",
          cursor: "pointer",
          borderRadius: ".5rem",
        }}
      >
        <div className="flex">
          {state[0].startDate && state[0].endDate ? (
            <>
              {state[0].startDate?.toLocaleDateString()} -{" "}
              {state[0].endDate?.toLocaleDateString()}
            </>
          ) : (
            <div>Select From Date-To Date</div>
          )}
        </div>
        <div className="flex">
          <CalendarTodayIcon />
        </div>
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ overflowX: "scroll" }}
      >
        <DateRangePicker
          onChange={handleSelect}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          ranges={
            state[0].startDate && state[0].endDate
              ? state
              : [
                  {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: "selection",
                  },
                ]
          }
          months={2}
          direction="horizontal"
          locale={enUS}
          staticRanges={staticRanges}
          className="my-date-range-picker"
        />
      </Popover>
    </div>
  );
};

export default CommanDateRangePicker;
