/**
 * Add/Remove Friend Confirmation Modal component
 */

import { Modal, Box, Button, Avatar } from "@mui/material";
import { getUserID } from "../../utils/localStorage";
import { useState } from "react";
import {
  submitFriendRequest,
  removeFriendOrRequest,
} from "../../services/friendsAPI";
/**
 * Builds and renders the Add/Remove Friend component
 * @returns Add/Remove Friend Confirmation Modal component render
 */

const AddFriendConfirmation = ({
  addFriendModalOpen,
  setAddFriendModalOpen,
  friend,
  isAdd,
  setRefresh,
}) => {
  // state objects
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // handle modal closing
  const handleClose = () => setAddFriendModalOpen(false);

  //send friend request
  const sendFriendRequest = async () => {
    setLoading(true);

    const requesteeID = friend.AccountID;
    const requesterID = getUserID();

    try {
      const response = await submitFriendRequest(requesterID, requesteeID);
      console.log(response);
      handleClose();
      alert("Friend request sent!");
      setRefresh(true);
    } catch (err) {
      console.log(err);
      setMessage("An error occurred. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Remove a friend
  const removeFriend = async () => {
    try {
      await removeFriendOrRequest(friend.AccountID);
      handleClose();
      alert("Friend removed");
      setRefresh(true);
    } catch (err) {
      console.log(err);
      setMessage("An error occurred. Try again later.");
    } finally {
      setLoading(false);
    }
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
          <h2>{isAdd ? "Friend request" : "Remove friend"}</h2>
        </div>
        <div className="confirmation-modal-center">
          <Avatar
            className="user-chip-avatar"
            alt={friend ? friend.DisplayName : "User"}
            src={friend ? friend.Avatar : null}
          />
          <span>
            Do you want to {isAdd ? "send" : "remove"}{" "}
            {friend && friend.DisplayName}{" "}
            {isAdd ? "a friend request?" : "from your friends?"}
          </span>
        </div>
        <Button
          id="add-friend-bttn"
          variant="contained"
          onClick={isAdd ? sendFriendRequest : removeFriend}
        >
          {isAdd ? "Send request" : "Remove friend"}
        </Button>
        {loading && (
          <p>{isAdd ? "Sending request..." : "Removing friend..."}</p>
        )}
        {message && <p className="error-message">{message}</p>}
      </Box>
    </Modal>
  );
};

//Export the Add/Remove Friend Confirmation Modal component
export default AddFriendConfirmation;
