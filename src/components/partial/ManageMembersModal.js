/**
 * Manage Group Members Modal component
 */

import { Modal, Box, InputAdornment, TextField } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import MemberChip from "./MemberChip";

/**
 * Builds and renders the Manage Group Members Modal component
 * @returns Manage Members Modal component render
 */

const ManageMembersModal = ({
  manageMembersModalOpen,
  setManageMembersModalOpen,
  members,
  setRefresh
}) => {
  // handle modal closing
  const handleClose = () => setManageMembersModalOpen(false);

  // Handle friends search
  const friendSearch = () => {
    console.log("This will trigger a search function");
  };

  // Component state objects
  const [searchString, setSearchString] = useState("");

  return (
    <Modal
      id="manage-friends-modal-background"
      open={manageMembersModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box id="manage-friends-modal">
        <div id="manage-friends-modal-header">
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
        <div className="manage-friends-link">
          <PeopleAltOutlinedIcon />
          <p>Add member</p>
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

//Export the Manage Members Modal component
export default ManageMembersModal;
