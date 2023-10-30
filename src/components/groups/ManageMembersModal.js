/**
 * Manage Group Members Modal component
 */

import {
  Modal,
  Box,
  InputAdornment,
  TextField,
  Autocomplete,
  Chip,
  CircularProgress,
  Avatar,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import MemberChip from "../partial/MemberChip";

/**
 * Builds and renders the Manage Group Members Modal component
 * @returns Manage Members Modal component render
 */

const ManageMembersModal = ({
  manageMembersModalOpen,
  setManageMembersModalOpen,
  members,
  users,
  setRefresh,
}) => {

  // Component state objects
  const [searchString, setSearchString] = useState("");
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [friendToAdd, setFriendToAdd] = useState(null);
  const loading = open && options.length === 0;

  // Loading function (async)
  function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  // Effects
  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...users]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  // Methods
  // Handle friend add
  const handleAddMember = (option) => {
    setFriendToAdd(option);
    console.log("Add member to group function");
  };

  // handle modal closing
  const handleClose = () => setManageMembersModalOpen(false);

  return (
    <Modal
      id="manage-friends-modal-background"
      open={manageMembersModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box id="manage-members-modal">
        <div id="manage-members-modal-header">
          <h2>Manage Members</h2>
        </div>
        <div id="manage-friends-modal-whitebox">
          {members &&
            members.map((member, i) => {
              return (
                <MemberChip
                  key={i}
                  member={member}
                  request={false}
                  setRefresh={setRefresh}
                  setManageFriendsModalOpen={setManageMembersModalOpen}
                />
              );
            })}
        </div>
        <div className="manage-friends-bottom">
          <div className="manage-friends-link">
            <PeopleAltOutlinedIcon />
            <p>Add member</p>
          </div>
          <Autocomplete
            disableCloseOnSelect
            sx={{ width: "90%" }}
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            isOptionEqualToValue={(option, value) =>
              option.DisplayName === value.name
            }
            getOptionLabel={(option) => option.DisplayName}
            renderOption={(props, option) => (
              <li>
                <Chip
                  clickable
                  key={option}
                  icon={<Avatar src={option.Avatar} />}
                  className="friend-search-chip"
                  label={option.DisplayName}
                  sx={{ width: "100%", height: "fit-content", borderRadius:"80px", padding: "10px" }}
                  deleteIcon={
                    <PersonAddOutlinedIcon className="add-friend-icon" />
                  }
                  onDelete={() => handleAddMember(option)}
                />
              </li>
            )}
            options={options}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                id="manage-friends-searchbar"
                variant="outlined"
                placeholder="Add a new group member..."
                value={searchString}
                onChange={(event) => setSearchString(event.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <InputAdornment position="end">
                          <SearchIcon color="primary" />
                        </InputAdornment>
                      )}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>
      </Box>
    </Modal>
  );
};

//Export the Manage Members Modal component
export default ManageMembersModal;
