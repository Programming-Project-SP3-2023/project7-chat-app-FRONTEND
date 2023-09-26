import { TextField, Avatar, Box } from "@mui/material";
import { Modal } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";

import { getUser } from "../../utils/localStorage";

import { useState } from "react";

import PasswordUpdateModal from "./PasswordUpdate";

const EditProfile = ({ editProfileModalOpen, setEditProfileModalOpen }) => {
  const user = getUser();

  // close modal
  const handleClose = () => {
    setEditProfileModalOpen(false);
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // Handles image upload and formats it to Base64
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const data = new FileReader();
      data.addEventListener('load', () => {
        setSelectedImage(data.result);
      })
      data.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div>
      <Modal
        id="edit-profile-modal-background"
        open={editProfileModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="edit-profile-modal">
          <div id="edit-profile-modal-header">
            <h3>Manage Account Settings</h3>
          </div>
          <div id="edit-profile-modal-body">
            <div className="edit-avatar-img-box">
              <label>
                <input
                  id="edit-avatar-img-input"
                  accept="image/*"
                  type="file"
                  onChange={imageChange}
                />
                <Avatar id="edit-profile-avatar">
                  <div id="edit-avatar-upload-box">
                    {!selectedImage ? (
                      <PersonOutlineIcon />
                    ) : (
                      <img src={selectedImage} alt="Uploaded Event" />
                    )}
                  </div>
                </Avatar>
              </label>
            </div>
            <div id="edit-profile-modal-textfields-container">
              {/* name */}
              <p>Name</p>
              {/* textfield with users name */}
              <TextField
                fullWidth
                id="name"
                variant="outlined"
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                placeholder={user.name}
                InputProps={{
                  endAdornment: (
                    <IconButton position="end">
                      <EditIcon color="primary" />
                    </IconButton>
                  ),
                }}
              />
              <p>Email</p>
              {/* textfield with users email */}
              <TextField
                fullWidth
                id="email"
                variant="outlined"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder={user.email}
                InputProps={{
                  endAdornment: (
                    <IconButton position="end">
                      <EditIcon color="primary" />
                    </IconButton>
                  ),
                }}
              />
              <p>Date of Birth</p>
              {/* textfield with users date of birth */}
              <TextField
                fullWidth
                id="dateOfBirth"
                variant="outlined"
                value={dateOfBirth}
                onChange={(event) => setDateOfBirth(event.target.value)}
                type="date"
                placeholder={user.dateOfBirth}
                InputProps={{
                  endAdornment: (
                    <IconButton position="end">
                      <EditIcon color="primary" />
                    </IconButton>
                  ),
                }}
              />
              {/* change password button/modal/dialog box */}
              <div id="edit-profile-modal-btn-container">
                <PasswordUpdateModal />
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default EditProfile;
