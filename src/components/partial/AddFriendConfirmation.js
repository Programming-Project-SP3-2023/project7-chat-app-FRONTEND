/**
 * Add Friend Confirmation Modal component
 */

import { Modal, Box, Button, Avatar } from "@mui/material";
import { getUserID } from "../../utils/localStorage";
import { useState } from "react";
import { submitFriendRequest } from "../../services/friendsAPI";
/**
 * Builds and renders the Add Group component
 * @returns Add Friend Confirmation Modal component render
 */

const AddFriendConfirmation = ({
  addFriendModalOpen,
  setAddFriendModalOpen,
  friendToAdd,
}) => {
  // state objects
  const [loading, setLoading] = useState(false);

  // handle modal closing
  const handleClose = () => setAddFriendModalOpen(false);

  //send friend request
  const sendFriendRequest = async () => {
    setLoading(true);

    const requesteeID = friendToAdd.AccountID;
    const requesterID = getUserID();
    console.log(requesteeID, requesterID);

    try {
      const response = await submitFriendRequest(requesterID, requesteeID);
      console.log(response);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
    handleClose();
  };

  return (
    <Modal
      id="add-friend-modal-background"
      open={addFriendModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box id="add-friend-modal">
        <div id="add-friend-modal-header">
          <h2>Friend request</h2>
        </div>
        <div className="confirmation-modal-center">
          <Avatar
            className="user-chip-avatar"
            alt="Sample profile"
            src={friendToAdd ? friendToAdd.Avatar : null}
          />
          <span>
            Do you want to send {friendToAdd && friendToAdd.DisplayName} a
            friend request?
          </span>
        </div>
        <Button
          id="add-friend-bttn"
          variant="contained"
          onClick={sendFriendRequest}
        >
          Send request
        </Button>
        {loading && <h2>Sending request...</h2>}
      </Box>
    </Modal>
  );
};

//Export the Add Friend Confirmation Modal component
export default AddFriendConfirmation;
