import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Menu,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useDispatch, useSelector } from "react-redux";
import { getBAEntrysByDate } from "../../apis/mainSlice";
import moment from "moment";
import { Delete } from "@mui/icons-material";
import BootstrapTooltip from "../../components/Tooltip";

export default function ViewCreditDebitBAEntrys({
  etype,
  data,
  handelSetDebitAid,
  showTotalAmount,
  handleShowTotal,
}) {
  const dispatch = useDispatch();

  const currentDate = useSelector((state) => state.date.currentDate);
  const { loggedIn } = useSelector((state) => state.authData);
  const { baLoading, baEntrys } = useSelector((state) => state.mainData);

  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  useEffect(() => {
    if (Boolean(anchorEl2) && data && loggedIn) {
      dispatch(
        getBAEntrysByDate({
          uId: loggedIn?._id,
          baId: data?.entryId,
          date: moment(currentDate).format("YYYY-MM-DD"),
          tableType: "main",
          etype: etype,
        })
      );
    }
  }, [anchorEl2]);

  const TableHeadCellStyle = {
    padding: ".3rem .9rem",
    fontWeight: "bold",
  };
  const TableColumnCellStyle = {
    padding: ".2rem .9rem",
    textWrap: "nowrap",
  };

  return (
    <Box className="flex" style={{ width: "100%" }}>
      <div
        style={{
          cursor: "pointer",
          padding: "0",
          fontWeight: "bold",
          fontSize: ".9rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          position: "relative",
        }}
      >
        <BootstrapTooltip
          style={{ width: "100%" }}
          placement="right"
          title={
            <div style={{ fontSize: "1rem" }}>
              {data?.baAmt?.toLocaleString()}/-
            </div>
          }
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
        >
          <div className="flex" style={{ width: "100%" }}>
            <div
              style={{ width: "100%" }}
              onClick={() => handelSetDebitAid(data)}
            >
              {data?.entName}
            </div>
          </div>
        </BootstrapTooltip>
        <div
          onClick={handleClick2}
          style={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            left: "195px",
          }}
        >
          {Boolean(anchorEl2) ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </div>
      </div>
      {/* ------------------------------------------- */}
      {/* Details Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        elevation={0}
        sx={{
          "& .MuiMenu-paper": {
            width: "auto",
            border: "2px solid #000",
            padding: "0rem .5rem",
          },
        }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={TableHeadCellStyle}>Amount</TableCell>
                <TableCell sx={TableHeadCellStyle}>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {baLoading ? (
                <TableRow>
                  <TableCell sx={TableColumnCellStyle}>
                    <CircularProgress size={20} />
                  </TableCell>
                  <TableCell sx={TableColumnCellStyle}>
                    <CircularProgress size={20} />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {baEntrys?.length > 0 ? (
                    baEntrys.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={TableColumnCellStyle}>
                          {row.amount}
                        </TableCell>
                        <TableCell sx={TableColumnCellStyle}>
                          {row.entName} {row.byWhom && `(${row.byWhom})`}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell sx={TableColumnCellStyle}>No data</TableCell>
                      <TableCell sx={TableColumnCellStyle}>No data</TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Menu>
    </Box>
  );
}
