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
  friends,
  setRefresh,
}) => {
  // Component state objects
  const [searchString, setSearchString] = useState("");
  const [options, setOptions] = useState([]);
  const [friendOptions, setFriendOptions] = useState([]);
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

  // calculate friend options
  useEffect(() => {
    // get only members who are not friends
    const possibleOptions = [];
    const notPossible = [];
    friends.forEach((friend) => {
      members.forEach((member) => {
        if (friend.AccountID === member.AccountID) {
          notPossible.push(member.AccountID);
        }
      });
    });

    friends.forEach((friend) => {
      if (!notPossible.includes(friend.AccountID)) possibleOptions.push(friend);
    });

    setFriendOptions(possibleOptions);
    console.log("OPTIONS", friendOptions);
  }, [manageMembersModalOpen]);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...friendOptions]);
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
          {friendOptions.length > 0 ? (
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
                    sx={{
                      width: "100%",
                      height: "fit-content",
                      borderRadius: "80px",
                      padding: "10px",
                    }}
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
          ) : (
            <TextField
              sx={{ width: "90%" }}
              id="manage-friends-searchbar"
              variant="outlined"
              placeholder="You have already added all your friends"
              inputProps={{ readOnly: true }}
            />
          )}
        </div>
      </Box>
    </Modal>
  );
};

//Export the Manage Members Modal component
export default ManageMembersModal;
