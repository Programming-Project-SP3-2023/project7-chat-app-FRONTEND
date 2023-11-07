/**
 * Admin Users component
 */

import { useState, useEffect } from "react";
import { Box, Button, Stack, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NoRowsOverlay from "../partial/NoRowsOverlay";
import { getUsers } from "../../services/friendsAPI";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

/**
 * Builds and renders the Admin Users component
 * @returns Admin Users component render
 */
const AdminUsers = ({ setAdminTitle }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // set header title
  useEffect(() => {
    setAdminTitle("Manage Users");
  }, []);

  // fetch users
  useEffect(() => {
    setLoading(true);

    // 1. define fetch users function
    async function fetchUsers() {
      try {
        const response = await getUsers("");
        console.log("USERS: ", response[0]);
        setUsers(response[0]);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }

    // 2. call functions
    fetchUsers();
  }, []);

  // Handles editing user (row item)
  const handleEdit = (params) => {
    const currentRow = params.row;
    return alert(JSON.stringify(currentRow, null, 4));
  };

  // Handles deleting user (row item)
  const handleDelete = (params) => {
    const currentRow = params.row;
    return alert(JSON.stringify(currentRow, null, 4));
  };

  // Handles adding new user
  const handleAddUser = () => {
    alert("adding new user....");
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
      flex: 0.1,
      headerClassName: "top-row",
    },
    {
      field: "Email",
      headerName: "Email",
      minWidth: 200,
      flex: 0.2,
      headerClassName: "top-row",
    },
    {
      field: "DisplayName",
      headerName: "Name",
      minWidth: 150,
      flex: 0.15,
      headerClassName: "top-row",
    },
    {
      field: "Avatar",
      headerName: "Avatar",
      sortable: false,
      minWidth: 200,
      flex: 0.4,
      headerClassName: "top-row",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: "220",
      disableClickEventBubbling: true,
      flex: 0.15,
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
      <div className="top-buttons-wrapper">
        <h2>Echo's users</h2>
        <Button
          id="admin-add-user"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddUser}
        >
          Add new user
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
