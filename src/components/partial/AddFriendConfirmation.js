/**
 * Add Friend Confirmation Modal component
 */

import { Modal, Box, Button } from "@mui/material";
/**
 * Builds and renders the Add Group component
 * @returns Add Friend Confirmation Modal component render
 */

const AddFriendConfirmation = ({
  addFriendModalOpen,
  setAddFriendModalOpen,
  friendToAdd,
}) => {
  // handle modal closing
  const handleClose = () => setAddFriendModalOpen(false);

  //send friend request
  const sendFriendRequest = () => {
    handleClose();
    console.log("sending friend request to ", friendToAdd.name);
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
          Do you want to send {friendToAdd && friendToAdd.name} a friend
          request?
        </p>
        <Button
          id="add-friend-bttn"
          variant="contained"
          onClick={sendFriendRequest}
        >
          Send request
        </Button>
      </Box>
    </Modal>
  );
};

//Export the Add Friend Confirmation Modal component
export default AddFriendConfirmation;
