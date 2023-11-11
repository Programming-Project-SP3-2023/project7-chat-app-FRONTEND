/**
 * Admin Users component
 */

import { useState, useEffect } from "react";
import { Box, Button, Stack, CircularProgress, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NoRowsOverlay from "../partial/NoRowsOverlay";
import { getUsers } from "../../services/friendsAPI";
import { getAccounts, deleteAccount } from "../../services/adminAPI";
import RefreshIcon from "@mui/icons-material/Refresh";
import dayjs from "dayjs";
import AdminEditProfile from "./AdminEditProfile.js";
import DeleteConfirmation from "./DeleteConfirmation.js";
import AdminPasswordUpdate from "./AdminPasswordUpdate.js";

/**
 * Builds and renders the Admin Users component
 * @returns Admin Users component render
 */
const AdminUsers = ({ setAdminTitle }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminEditProfileModalOpen, setAdminEditProfileModalOpen] =
    useState(false);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);
  const [passwordUpdateOpen, setPasswordUpdateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [deleteOutcome, setDeleteOutcome] = useState(false);

  // set header title
  useEffect(() => {
    setAdminTitle("User Management Portal");
  }, []);

  // fetch users
  useEffect(() => {
    setLoading(true);

    // 1. define fetch user accounts
    async function fetchAccounts() {
      try {
        const response = await getAccounts();
        console.log("ACCOUNTS", response);
        setUsers(response);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }

    // 2. call function
    fetchAccounts();
  }, [refresh]);

  // Handles editing user (row item)
  const handleEdit = (params) => {
    const currentRow = params.row;
    setSelectedUser(currentRow);
    console.log(currentRow);
    setAdminEditProfileModalOpen(true);
  };

  // Handles editing password (row item)
  const handleEditPwd = (params) => {
    const currentRow = params.row;
    setSelectedUser(currentRow);
    console.log(currentRow);
    setPasswordUpdateOpen(true);
  };

  // Handles deleting user (row item)
  const handleDelete = async (params) => {
    const currentRow = params.row;
    await setSelectedUser(currentRow);
    console.log(currentRow);

    try {
      console.log("Deleting....", currentRow.AccountID);
      const response = await deleteAccount(currentRow.AccountID);
      console.log(response);
      await setDeleteOutcome(true);
    } catch (err) {
      console.log(err);
      await setDeleteOutcome(false);
    }

    setDeleteConfirmationModalOpen(true);
  };

  // specifies ID
  function getRowId(row) {
    return row.AccountID;
  }

  // specifies columns layout for user grid
  const columns = [
    {
      field: "AccountID",
      headerName: "ID",
      minWidth: 100,
      flex: 0.2,
      headerClassName: "top-row",
    },
    {
      field: "Email",
      headerName: "Email",
      minWidth: 200,
      flex: 0.23,
      headerClassName: "top-row",
    },
    {
      field: "DisplayName",
      headerName: "Name",
      minWidth: 150,
      flex: 0.2,
      headerClassName: "top-row",
    },
    {
      field: "Dob",
      headerName: "Date of Birth",
      minWidth: 150,
      flex: 0.15,
      headerClassName: "top-row",
      valueFormatter: (params) => dayjs(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "Avatar",
      headerName: "Avatar",
      sortable: false,
      minWidth: 100,
      flex: 0.12,
      headerClassName: "top-row",
      renderCell: (params) => {
        return <Avatar src={params.value} alt={params.row.DisplayName} />;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: "200",
      disableClickEventBubbling: true,
      flex: 0.3,
      headerClassName: "top-row",
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={() => handleEdit(params)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleEditPwd(params)}
            >
              Change Password
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(params)}
            >
              Delete
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <div className="admin-manage-screen">
      {/* Modals */}
      <AdminEditProfile
        adminEditProfileModalOpen={adminEditProfileModalOpen}
        setAdminEditProfileModalOpen={setAdminEditProfileModalOpen}
        user={selectedUser}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <DeleteConfirmation
        outcome={deleteOutcome}
        deleteConfirmationModalOpen={deleteConfirmationModalOpen}
        setDeleteConfirmationModalOpen={setDeleteConfirmationModalOpen}
        ID={selectedUser.AccountID}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <AdminPasswordUpdate
        selectedUser={selectedUser}
        passwordUpdateOpen={passwordUpdateOpen}
        setPasswordUpdateOpen={setPasswordUpdateOpen}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      {/* Main Body */}
      <div className="top-buttons-wrapper">
        <h2>Echo's users</h2>
        <Button
          id="admin-add-user"
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => setRefresh(!refresh)}
        >
          Refresh users
        </Button>
      </div>
      <Box id="admin-box" sx={{ width: "100%", backgroundColor: "white" }}>
        {loading ? (
          <div id="grid-loading-screen">
            <CircularProgress size={100} />
          </div>
        ) : (
          <DataGrid
            id="admin-datagrid"
            getRowId={getRowId}
            rows={users}
            columns={columns}
            disableRowSelectionOnClick
            slots={{ noRowsOverlay: NoRowsOverlay }}
            sx={{ "--DataGrid-overlayHeight": "50vh" }}
          />
        )}
      </Box>
    </div>
  );
};

//Export the Users component
export default AdminUsers;
