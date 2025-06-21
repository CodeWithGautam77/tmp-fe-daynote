import React, { useEffect, useState } from "react";
import TeamImg from "../../../Image/team.png";
import teamStyle from "./team.module.scss";
import { Button } from "@mui/material";
import TeamDialog from "../../Dailogs/TeamDialog";
import { deleteTeam, getMemberById, getTeam } from "../../../apis/teamSlice";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import EditIconImg from "../../../Image/editIcon.png";
import DeleteIconImg from "../../../Image/deleteIcon.png";
import { useParams } from "react-router-dom";
import { DeleteSweetAlert } from "../../../common/common";

export default function TeamTable() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [openTeamDialog, setOpenTeamDialog] = useState([false, null]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);
  const [isAddNew, setIsAddNew] = useState(false);

  const { loggedIn } = useSelector((state) => state.authData);
  const { teamLoading, team } = useSelector((state) => state.teamData);

  const handlePaginationModelChange = (model) => {
    setPage(model.page);
    setPageSize(model.pageSize);
  };

  const handelDelete = async (data) => {
    if (data._id && data.uId) {
      const response = () => dispatch(deleteTeam({ id: data?._id }));
      DeleteSweetAlert({
        title: "Are you sure you want to delete ?",
        icon1: "warning",
        title2: `${data?.name}`,
        text: "Member deleted successfully",
        icon2: "success",
        callApi: response,
      });
    }
  };

  useEffect(() => {
    if (!id) {
      async function callApi() {
        const response = await dispatch(
          getTeam({ uId: loggedIn?._id, page, pageSize })
        );
        // const response = await dispatch(getDoctors({ page, pageSize }));
        // console.log(response);
        setCount(response?.payload?.totalCount);
      }
      callApi();
    }
  }, [page, pageSize, loggedIn]);
  //   console.log(allDoctorsData);
  const columns = [
    {
      field: "actions",
      headerName: (
        <h3 style={{ width: "10rem" }} className="flex">
          Action
        </h3>
      ),
      flex: 1,
      //   width: 160,
      renderCell: (cell) => (
        <div className="flex gap-05" style={{ marginTop: ".5rem" }}>
          <div
            className="cursurPointer"
            onClick={() => setOpenTeamDialog([true, cell.row])}
          >
            <img src={EditIconImg} alt="EditIconImg" height={35} />
          </div>
          <div className="cursurPointer" onClick={() => handelDelete(cell.row)}>
            <img src={DeleteIconImg} alt="DeleteIconImg" height={35} />
          </div>
        </div>
      ),
    },
    {
      field: "name",
      //   headerAlign: "center",
      //   align: "center",
      headerName: <h3>Name</h3>,
      flex: 1,
      renderCell: (cell) => (
        <div style={{ textTransform: "capitalize" }}>
          {cell.row?.name?.replace("meto", "")}
        </div>
      ),
    },
    {
      field: "phone",
      headerName: <h3>Phone</h3>,
      flex: 1,
      //   width: 250,
    },
    {
      field: "",
      headerName: <h3>Final Salary</h3>,
      flex: 1,
      renderCell: (cell) => <div>{cell.row.salary - cell.row.adSalary}</div>,
    },
    {
      field: "absent",
      headerName: <h3>Absent</h3>,
      flex: 1,
      //   width: 250,
    },

    {
      field: "adSalary",
      headerName: <h3>Advance Salary</h3>,
      flex: 1,
      //   width: 250,
    },
    {
      field: "salary",
      headerName: <h3>Total Salary</h3>,
      flex: 1,
      //   width: 250,
    },

    // {
    //   field: "isClinic",
    //   headerName: "Clininc",
    // flex:1,
    //     width: 250,
    //   valueFormatter: (value) => {
    //     return value === "Y" ? "Yes" : value === "N" ? "No" : "";
    //   },
    // },
  ];

  useEffect(() => {
    if (id && loggedIn) {
      dispatch(getMemberById({ uId: loggedIn?._id, id: id }));
    }
  }, [id, loggedIn]);

  return (
    <div className={teamStyle.teamBox}>
      <div className={"flexBetween"}>
        <img src={TeamImg} alt="TeamImg" height={50} />
        <Button
          variant="contained"
          onClick={() => setOpenTeamDialog([true, null])}
        >
          Add Member
        </Button>
      </div>
      <div className={teamStyle.dataBox}>
        <DataGrid
          sx={{
            color: "#000",
            backgroundColor: "#fff",
            fontSize: ".8rem",
            fontWeight: "bold",
            // height: 650,
            border: "2px solid #AEAEAE",
            borderRadius: ".5rem",
          }}
          autoHeight
          rows={team}
          columns={columns}
          pagination
          paginationMode="server"
          loading={teamLoading}
          rowCount={count}
          disableColumnMenu
          initialState={{
            ...team.initialState,
            pagination: {
              ...team.initialState?.pagination,
              paginationModel: {
                pageSize: pageSize,
                page: page,
                /* page: 0 // default value will be used if not passed */
              },
            },
          }}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onPaginationModelChange={handlePaginationModelChange}
          rowsPerPageOptions={[10]}
          pageSizeOptions={[5, 10, 20]}
          getRowId={(e) => e._id}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0
              ? "rowbgColor1"
              : "rowbgColor2"
          }
        />
      </div>
      <TeamDialog
        openTeamDialog={openTeamDialog}
        setOpenTeamDialog={setOpenTeamDialog}
        setIsAddNew={setIsAddNew}
      />
    </div>
  );
}
