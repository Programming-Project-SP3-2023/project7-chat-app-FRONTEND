/**
 * Delete Group Confirmation Modal component
 */

import { Modal, Box, Button, Avatar } from "@mui/material";
import { useState } from "react";
import { deleteGroupByID } from "../../services/groupsAPI";
import { getAccessToken, setSideMenuOption } from "../../utils/localStorage";
import { useNavigate } from "react-router";

/**
 * Builds and renders the Add Group component
 * @returns Add Friend Confirmation Modal component render
 */

const DeleteGroupModal = ({
  deleteGroupModalOpen,
  setDeleteGroupModalOpen,
  group,
  groupReload,
  setGroupReload,
}) => {
  // state objects
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  // handle modal closing
  const handleClose = () => setDeleteGroupModalOpen(false);

  // handles group delete
  const deleteGroupHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteGroupByID(group.groupID, getAccessToken());
      setSideMenuOption(0);
      handleClose();
      setGroupReload(!groupReload);
      navigate("/dashboard");
    } catch (err) {
      setMessage("Something went wrong. We couldn't delete the group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      id="add-friend-modal-background"
      open={deleteGroupModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box id="add-friend-modal">
        <div id="add-friend-modal-header">
          <h2>Delete Group</h2>
        </div>
        <div className="confirmation-modal-center">
          <Avatar
            className="user-chip-avatar"
            alt={group ? group.groupName : "Group"}
            src={group ? group.groupAvatar : null}
          />
          <span>
            Are you sure you want to delete {group && group.groupName}?
          </span>
        </div>
        <Button
          id="add-friend-bttn"
          variant="contained"
          onClick={deleteGroupHandler}
          sx={{ backgroundColor: "red" }}
        >
          Delete
        </Button>
        {loading && <p>Deleting group...</p>}
        {message && <p className="error-message">{message}</p>}
      </Box>
    </Modal>
  );
};

//Export the Delete Group Modal component
export default DeleteGroupModal;
