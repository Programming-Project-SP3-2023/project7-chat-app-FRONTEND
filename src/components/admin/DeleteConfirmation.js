/**
 * Delete Confirmation Modal component
 */

import { Modal, Box, Button, setRef } from "@mui/material";

/**
 * Builds and renders the Add Group component
 * @returns Add Friend Confirmation Modal component render
 */

const DeleteConfirmation = ({
  outcome,
  setDeleteConfirmationModalOpen,
  deleteConfirmationModalOpen,
  ID,
  refresh,
  setRefresh,
}) => {
  // handle modal closing
  const handleClose = () => {
    setDeleteConfirmationModalOpen(false);
    setRefresh(!refresh);
  };

  return (
    <Modal
      id="add-friend-modal-background"
      open={deleteConfirmationModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box id="add-friend-modal">
        <div className="delete-modal">
          <h2>
            {outcome
              ? `User ${ID} account successfully deleted.`
              : "An error occurred. Try again later."}
          </h2>
          <Button
            id="add-friend-bttn"
            variant="contained"
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

//Export the Delete Confirmation Modal component
export default DeleteConfirmation;
