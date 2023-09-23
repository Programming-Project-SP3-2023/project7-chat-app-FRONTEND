/**
 * Add Group component
 */

import { Modal, Box, TextField, Link, Button } from "@mui/material";
import { useState } from "react";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
/**
 * Builds and renders the Add Group component
 * @returns Add Group component render
 */

const AddGroup = ({ groupModalOpen, setGroupModalOpen }) => {
  // handle modal closing
  const handleClose = () => setGroupModalOpen(false);

  // state variables for form
  const [selectedImage, setSelectedImage] = useState(null);
  const [blobURL, setBlobURL] = useState(null);
  const [groupName, setGroupName] = useState("");

  // handles image change and file upload
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const blob = e.target.files[0];
      const url = URL.createObjectURL(blob);
      setBlobURL(url);
      setSelectedImage(blob);
    }
  };
  return (
    <Modal
      id="add-group-modal-background"
      open={groupModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box id="add-group-modal">
        <div id="add-group-modal-header">
          <h2>New Group</h2>
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
                {!selectedImage ? (
                  <AddPhotoAlternateOutlinedIcon />
                ) : (
                  <img src={blobURL} alt="Uploaded Event" />
                )}
              </div>
            </label>
          </div>
          <TextField
            fullWidth
            id="group-name-txtfield"
            variant="outlined"
            placeholder="Enter group name..."
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
          />
          <Link><div id="add-group-link"><GroupAddOutlinedIcon /><p>Invite Members (Optional)</p></div></Link>
          <Button id="add-group-bttn" variant="contained">Create Group</Button>
        </form>
      </Box>
    </Modal>
  );
};

//Export the Add Group component
export default AddGroup;
