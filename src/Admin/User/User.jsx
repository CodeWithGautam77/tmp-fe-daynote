import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import UserModal from "./UserModal";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../apis/userSlice";
import moment from "moment";

export default function User() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0); // DataGrid is 0-based
  const [pageSize, setPageSize] = useState(10);
  const [editData, setEditData] = useState(null);

  const { users, userLoading, totalUsers } = useSelector(
    (state) => state.userData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers({ page: page, pageSize })); // API expects 1-based page
  }, [dispatch, page, pageSize]);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      renderCell: (params) => (
        <div>{params?.row?.type === "H" ? "Wholesale" : "Retail"}</div>
      ),
    },
    {
      field: "cutOff",
      headerName: "Cut Off (%)",
      renderCell: (params) => (
        <div>{params?.row?.cutOff ? params?.row?.cutOff : "-"}</div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params) => (
        <div>{moment(params?.row?.createdAt).format("DD-MM-YY h:MM A")}</div>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
      renderCell: (params) => (
        <div>{moment(params?.row?.updatedAt).format("DD-MM-YY h:MM A")}</div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={() => {
            // Handle edit action here
            setEditData(params.row);
            setOpen(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];
  
  return (
    <>
      <div>
        <div className="flexBetween">
          <h3>Users</h3>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Create User
          </Button>
        </div>
        <div style={{ height: 500, width: "100%", marginTop: 16 }}>
          <DataGrid
            rows={users}
            columns={columns}
            loading={userLoading}
            rowCount={totalUsers} // Total count of users
            pagination
            paginationMode="server"
            page={page}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20, 50]}
            disableSelectionOnClick
            autoHeight
            getRowId={(e) => e._id} // Assuming each user has a unique _id
          />
        </div>
      </div>

      <UserModal
        setOpen={setOpen}
        open={open}
        editData={editData}
        setEditData={setEditData}
      />
    </>
  );
}
