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
import {
  deleteBankAngadiaAccEntry,
  getBAEntrysByDate,
} from "../../apis/mainSlice";
import moment from "moment";
import { Delete } from "@mui/icons-material";
import { DeleteSweetAlert } from "../../common/common";
import BootstrapTooltip from "../../components/Tooltip";

export default function ViewDebitBankEntrys({
  data,
  handelSetBAid,
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
          baId: data?._id,
          date: moment(currentDate).format("YYYY-MM-DD"),
          tableType: "debitBank",
        })
      );
    }
  }, [anchorEl2]);

  const handeDelete = async (rowData) => {
    if (data && rowData) {
      setAnchorEl2(null);
      const response = () =>
        dispatch(
          deleteBankAngadiaAccEntry({
            _id: rowData._id,
            uId: loggedIn?._id,
            date: moment(currentDate).format("YYYY-MM-DD"),
            baId: rowData.baId,
            amount: rowData.amount,
            baEntityId: data.entryId,
          })
        );
      DeleteSweetAlert({
        title: `Are you sure you want to delete ${data.entName} ${data.amount} entry?`,
        icon1: "warning",
        title2: `${rowData.entName} ${rowData.amount}`,
        text: "Entry deleted successfully",
        icon2: "success",
        callApi: response,
      });
    }
  };

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
            <div style={{ width: "100%" }} onClick={() => handelSetBAid(data)}>
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
                <TableCell sx={TableHeadCellStyle}>Action</TableCell>
                <TableCell sx={TableHeadCellStyle}>Amount</TableCell>
                <TableCell sx={TableHeadCellStyle}>Name</TableCell>
                <TableCell sx={TableHeadCellStyle}>City</TableCell>
                <TableCell sx={TableHeadCellStyle}>Phone</TableCell>
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
                  <TableCell sx={TableColumnCellStyle}>
                    <CircularProgress size={20} />
                  </TableCell>
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
                          <div onClick={() => handeDelete(row)}>
                            <Delete
                              sx={{
                                color: "red",
                              }}
                              fontSize="small"
                            />
                          </div>
                        </TableCell>
                        <TableCell sx={TableColumnCellStyle}>
                          {row.amount}
                        </TableCell>
                        <TableCell sx={TableColumnCellStyle}>
                          {row.entName}
                        </TableCell>
                        <TableCell sx={TableColumnCellStyle}>
                          {row.entArea}
                        </TableCell>
                        <TableCell sx={TableColumnCellStyle}>
                          {row.entPhone}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell sx={TableColumnCellStyle}>No data</TableCell>
                      <TableCell sx={TableColumnCellStyle}>No data</TableCell>
                      <TableCell sx={TableColumnCellStyle}>No data</TableCell>
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
