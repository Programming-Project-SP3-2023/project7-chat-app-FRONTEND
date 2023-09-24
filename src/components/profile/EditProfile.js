import { TextField, Avatar, Box } from "@mui/material";
import { Modal } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";

import { getUser } from "../../utils/localStorage";

import { useState } from "react";

import PasswordUpdateModal from "./PasswordUpdate";
import AvatarUpdateModal from "./AvatarUpdate";

const EditProfile = ({ editProfileModalOpen, setEditProfileModalOpen }) => {
  const user = getUser();

  // close modal
  const handleClose = () => {
    setEditProfileModalOpen(false);
  };

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

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
            <div id="edit-profile-modal-avatar">
              <Avatar src={user.Avatar} sx={{ width: 100, height: 100 }}>
                <PersonOutlineIcon />
              </Avatar>
              <div>
                <AvatarUpdateModal />
              </div>
            </div>
            <div id="edit-profile-modal-textfields-container">
              {/* name */}
              <p>Name</p>
              {/* textfield with users name */}
              <TextField
                fullWidth
                id="username"
                variant="outlined"
                label={user.username}
                type="text"
                placeholder={user.username}
                value={username}
                InputProps={{
                  endAdornment: <IconButton>{<EditIcon />}</IconButton>,
                }}
              />
              <p>Email</p>
              {/* textfield with users email */}
              <TextField
                fullWidth
                id="email"
                variant="outlined"
                label={user.email}
                type="text"
                placeholder={user.email}
                value={username}
                InputProps={{
                  endAdornment: <IconButton>{<EditIcon />}</IconButton>,
                }}
              />
              <p>Date of Birth</p>
              {/* textfield with users date of birth */}
              <TextField
                fullWidth
                id="dateOfBirth"
                variant="outlined"
                label={user.dateOfBirth}
                type="text"
                placeholder={user.dateOfBirth}
                value={username}
                InputProps={{
                  endAdornment: <IconButton>{<EditIcon />}</IconButton>,
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
