/**
 * Manage Friends Modal component
 */

import { Modal, Box, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import UserChip from "./UserChip";
/**
 * Builds and renders the Manage Friends Modal component
 * @returns Manage Friends Modalcomponent render
 */

const ManageFriendsModal = ({
  manageFriendsModalOpen,
  setManageFriendsModalOpen,
}) => {
  // dummy friends objects for development.
  const friends = [
    {
      id: "001",
      name: "Jack Sparrow",
      img: "something/src.jpg",
      status: 0,
      lastSent: true,
      lastMessage: "Hey, what do you think of my new phone",
    },
    {
      id: "002",
      name: "Coco Wood",
      img: "something/src.jpg",
      status: 1,
      lastSent: false,
      lastMessage: "Kevin, meet me there when the sun goes down",
    },
    {
      id: "003",
      name: "Juliette Barton",
      img: "something/src.jpg",
      status: 2,
      lastSent: false,
      lastMessage: null,
    },
    {
      id: "004",
      name: "Mark Ruffalo",
      img: "something/src.jpg",
      status: 0,
      lastSent: true,
      lastMessage:
        "Dear Rosa, you were not originally meant to pick up groceries",
    },
    {
      id: "005",
      name: "Ryan Borges",
      img: "something/src.jpg",
      status: 0,
      lastSent: true,
      lastMessage:
        "Dear Rosa, you were not originally meant to pick up groceries",
    },
  ];

  // friend requests objects for development.
  const friendRequests = [
    {
      id: "006",
      name: "Rafael Bonachela",
      img: "something/src.jpg",
      notificationOn: false,
    },
    {
      id: "007",
      name: "Morgan Hurrel",
      img: "something/src.jpg",
      notificationOn: true
    }
  ];

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
        {friendRequests.map((friend, i) => {
            return <UserChip key={i} user={friend} request={true} />;
          })}
          {friends.map((friend, i) => {
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
