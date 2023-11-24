/**
 * Manage Group Settings Modal component
 */

import { Modal, Box, TextField, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { updateGroupAvatar, updateGroupName } from "../../services/groupsAPI";

/**
 * Builds and renders the Manage Group Settings Modal component
 * @returns Manage Group Settings Modal component render
 */

const ManageGroupSettings = ({
  manageGroupSettingsModalOpen,
  setManageGroupSettingsModalOpen,
  group,
  groupReload,
  setGroupReload,
  setDeleteGroupModalOpen,
}) => {
  // state variables for form
  const [selectedImage, setSelectedImage] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState("");
  const [groupID, setGroupID] = useState("");
  const [processing, setProcessing] = useState(false);

  // METHODS
  // handle modal closing
  const handleClose = () => setManageGroupSettingsModalOpen(false);

  const handleStartDelete = () => {
    setDeleteGroupModalOpen(true);
    handleClose();
  };

  useEffect(() => {
    setGroupName(group.groupName);
    setGroupImage(group.groupAvatar);
    setGroupID(group.groupID);
  }, [manageGroupSettingsModalOpen]);

  // handles image change and file upload (base64)
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const data = new FileReader();
      data.addEventListener("load", () => {
        setSelectedImage(data.result);
      });
      data.readAsDataURL(e.target.files[0]);
    }
  };

  // handles group info update
  const updateGroupInfo = async (e) => {
    e.preventDefault();
    setProcessing(true);
    if (selectedImage) {
      try {
        const response = await updateGroupAvatar(groupID, selectedImage);
      } catch (err) {
      }
    }

    if (groupName !== "") {
      try {
        const response = await updateGroupName(groupID, groupName);
      } catch (err) {
      }
    }

    setGroupReload(!groupReload);
    setProcessing(false);
  };

  return (
    <Modal
      id="add-group-modal-background"
      open={manageGroupSettingsModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="add-group-modal" id="manage-group-settings">
        <div id="add-group-modal-header">
          <h2>Manage Group Settings</h2>
        </div>
        <>
          {processing ? (
            <CircularProgress size={100} />
          ) : (
            <form id="add-group-modal-body">
              <div className="add-group-img-box">
                <label>
                  <input
                    id="add-group-img-input"
                    accept="image/*"
                    type="file"
                    onChange={imageChange}
                  />
                  <div id="img-upload-box">
                    {!selectedImage && !groupImage && (
                      <AddPhotoAlternateOutlinedIcon />
                    )}
                    {!selectedImage && groupImage && (
                      <img src={groupImage} alt={groupName} />
                    )}
                    {selectedImage && (groupImage || !groupImage) && (
                      <img src={selectedImage} alt={groupName} />
                    )}
                  </div>
                </label>
              </div>
              <div id="manage-group-settings-textfield">
                <p>Group Name</p>
                <TextField
                  fullWidth
                  id="group-name-txtfield"
                  variant="outlined"
                  placeholder="Enter group name..."
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                />
              </div>
              <Button
                id="manage-group-submit-button"
                variant="contained"
                type="submit"
                onClick={updateGroupInfo}
              >
                Save changes
              </Button>
              <button
                id="group-delete-bttn"
                className="group-button"
                onClick={handleStartDelete}
              >
                <DeleteOutlineOutlinedIcon />
                <h3>Delete group</h3>
              </button>
            </form>
          )}
        </>
      </Box>
    </Modal>
  );
};

//Export the Manage Group Settings Modal component
export default ManageGroupSettings;
