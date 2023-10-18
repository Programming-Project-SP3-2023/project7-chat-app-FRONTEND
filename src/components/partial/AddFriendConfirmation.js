/**
 * Add Friend Confirmation Modal component
 */

import { Modal, Box, Button } from "@mui/material";
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

    const response = await submitFriendRequest(requesterID, requesteeID);
    console.log(response);
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
        <p>
          Do you want to send {friendToAdd && friendToAdd.DisplayName} a friend
          request?
        </p>
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
