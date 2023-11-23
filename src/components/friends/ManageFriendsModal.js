/**
 * Manage Friends Modal component
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
import UserChip from "../partial/UserChip";
import { useState, useEffect } from "react";
import { getNonfriends } from "../../utils/utils";

/**
 * Builds and renders the Manage Friends Modal component
 * @returns Manage Friends Modalcomponent render
 */

const ManageFriendsModal = ({
  manageFriendsModalOpen,
  setManageFriendsModalOpen,
  users,
  friends,
  friendRequests,
  setRefresh,
  setFriendToAdd,
  setAddFriendModalOpen,
  setIsAdd
}) => {
  // Loading function (async)
  function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  // Component state objects
  const [searchString, setSearchString] = useState("");
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const loading = open && options.length === 0;

  // Effects
  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        const notFriends = getNonfriends(users, friends);
        setOptions([...notFriends]);
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
  const handleAddFriend = (option) => {
    setIsAdd(true);
    setFriendToAdd(option);
    setAddFriendModalOpen(true);
  };

  // handle modal closing
  const handleClose = () => setManageFriendsModalOpen(false);

  return (
    <Modal
      id="manage-friends-modal-background"
      open={manageFriendsModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box id="manage-friends-modal">
        <div id="manage-friends-modal-header">
          <h2>Manage Friends</h2>
        </div>
        <div id="manage-friends-modal-whitebox">
          {friendRequests &&
            friendRequests.map((friend, i) => {
              return (
                <UserChip
                  key={i}
                  user={friend}
                  request={true}
                  setRefresh={setRefresh}
                  setManageFriendsModalOpen={setManageFriendsModalOpen}
                />
              );
            })}
          {friends &&
            friends.map((friend, i) => {
              return (
                <UserChip
                  key={i}
                  user={friend}
                  request={false}
                  setRefresh={setRefresh}
                  setManageFriendsModalOpen={setManageFriendsModalOpen}
                  setIsAdd={setIsAdd}
                  setFriendToAdd={setFriendToAdd}
                  setAddFriendModalOpen={setAddFriendModalOpen}
                />
              );
            })}
        </div>
        <div className="manage-friends-bottom">
          <div className="manage-friends-link">
            <PeopleAltOutlinedIcon />
            <p>Search user</p>
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
                  key={option.DisplayName}
                  icon={<Avatar src={option.Avatar} />}
                  className="friend-search-chip"
                  label={option.DisplayName}
                  sx={{ width: "100%", height: "fit-content", borderRadius:"80px", padding: "10px" }}
                  deleteIcon={
                    <PersonAddOutlinedIcon className="add-friend-icon" />
                  }
                  onDelete={() => handleAddFriend(option)}
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
                placeholder="Add a new friend..."
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

//Export the Manage Friends Modal component
export default ManageFriendsModal;
