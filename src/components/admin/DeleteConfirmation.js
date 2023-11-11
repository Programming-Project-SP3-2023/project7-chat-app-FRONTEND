/**
 * Delete Confirmation Modal component
 */

import { Modal, Box, Button } from "@mui/material";

/**
 * Builds and renders the Add Group component
 * @returns Add Friend Confirmation Modal component render
 */

const DeleteConfirmation = ({
  outcome,
  setDeleteConfirmationModalOpen,
  deleteConfirmationModalOpen,
  ID,
}) => {
  // handle modal closing
  const handleClose = () => setDeleteConfirmationModalOpen(false);

  return (
    <Modal
      id="add-friend-modal-background"
      open={deleteConfirmationModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box id="add-friend-modal">
        <h2>
          {outcome
            ? `User ${ID} account successfully deleted.`
            : "An error occurred. Try again later."}
        </h2>
        <Button id="add-friend-bttn" variant="contained" onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

//Export the Delete Confirmation Modal component
export default DeleteConfirmation;
