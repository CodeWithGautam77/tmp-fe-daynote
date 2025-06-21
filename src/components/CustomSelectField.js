import React from "react";
import { styled } from "@mui/material/styles";
import { Select, MenuItem } from "@mui/material";

const CustomSelect = styled((props) => <Select {...props} />)(({ theme }) => ({
  "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey[200],
  },
  // zIndex: 0,
}));

export default function CustomSelectField({
  placeholder,
  value,
  name,
  onChange,
  menuArr,
  id,
  disabled,
  defultOpt,
  label,
  labelId,
}) {
  return (
    <>
      <CustomSelect
        placeholder={placeholder}
        id={id}
        value={value}
        name={name}
        onChange={onChange}
        disabled={disabled}
        variant="outlined"
        label={label}
        labelId={labelId}
      >
        {defultOpt}
        {menuArr.map((item, index) => (
          <MenuItem key={index} value={item.value || item}>
            {item.label || item}
          </MenuItem>
        ))}
      </CustomSelect>
    </>
  );
}
