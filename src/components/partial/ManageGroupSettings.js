/**
 * Manage Group Settings Modal component
 */

import { Modal, Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
/**
 * Builds and renders the Manage Group Settings Modal component
 * @returns Manage Group Settings Modal component render
 */

const ManageGroupSettings = ({
  manageGroupSettingsModalOpen,
  setManageGroupSettingsModalOpen,
  group,
}) => {
  // handle modal closing
  const handleClose = () => setManageGroupSettingsModalOpen(false);

  // state variables for form
  const [selectedImage, setSelectedImage] = useState(null);
  const [groupName, setGroupName] = useState(group.GroupName);

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
                {!selectedImage && !group.avatar && (
                  <AddPhotoAlternateOutlinedIcon />
                )}
                {!selectedImage && group.avatar && (
                  <img src={group.avatar} alt={group.GroupName} />
                )}
                {selectedImage && group.avatar && (
                  <img src={selectedImage} alt={group.GroupName} />
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
          >
            Save changes
          </Button>
          <button id="group-delete-bttn" className="group-button">
            <DeleteOutlineOutlinedIcon />
            <h3>Delete group</h3>
          </button>
        </form>
      </Box>
    </Modal>
  );
};

//Export the Manage Group Settings Modal component
export default ManageGroupSettings;
