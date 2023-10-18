/**
 * Manage Friends Modal component
 */

import { Modal, Box, InputAdornment, TextField } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import UserChip from "./UserChip";
import { useState, useEffect } from "react";
import { getFriendRequests } from "../../services/friendsAPI";

/**
 * Builds and renders the Manage Friends Modal component
 * @returns Manage Friends Modalcomponent render
 */

const ManageFriendsModal = ({
  manageFriendsModalOpen,
  setManageFriendsModalOpen,
  users,
  friends,
  friendRequests
}) => {
  const [loading, setLoading] = useState(false);

  // handle modal closing
  const handleClose = () => setManageFriendsModalOpen(false);

  // Handle friends search
  const friendSearch = () => {
    console.log("This will trigger a search function");
  };

  // Component state objects
  const [searchString, setSearchString] = useState("");

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
          {friendRequests && friendRequests.map((friend, i) => {
            return <UserChip key={i} user={friend} request={true} />;
          })}
          {friends && friends.map((friend, i) => {
            return <UserChip key={i} user={friend} request={false} />;
          })}
        </div>
        <div className="manage-friends-link">
          <PeopleAltOutlinedIcon />
          <p>Search User</p>
        </div>
        <TextField
          sx={{ width: "90%" }}
          id="manage-friends-searchbar"
          variant="outlined"
          placeholder="Search for a friend..."
          value={searchString}
          onChange={(event) => setSearchString(event.target.value)}
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <SearchIcon
                    id="search-icon"
                    color="primary"
                    onClick={friendSearch}
                  />
                </InputAdornment>
              </>
            ),
          }}
        />
      </Box>
    </Modal>
  );
};

//Export the Manage Friends Modal component
export default ManageFriendsModal;
