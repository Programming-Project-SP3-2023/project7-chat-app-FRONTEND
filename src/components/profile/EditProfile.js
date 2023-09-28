import { TextField, Avatar, Box, Icon, useMediaQuery } from "@mui/material";
import { Modal } from "@mui/material";
import { getUser } from "../../utils/localStorage";
import { useState } from "react";

import ButtonGroup from "@mui/material/ButtonGroup";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import PasswordUpdateModal from "./PasswordUpdate";
import DoneIcon from "@mui/icons-material/Done";

const EditProfile = ({ editProfileModalOpen, setEditProfileModalOpen }) => {
  const user = getUser();

  // close modal
  const handleClose = () => {
    setEditProfileModalOpen(false);
  };
  // by setting useState as(true) each text field is disabled initially
  const [isNameDisabled, setIsNameDisabled] = useState(true);
  const [isEmailDisabled, setIsEmailDisabled] = useState(true);
  const [isDateOfBirthDisabled, setIsDateOfBirthDisabled] = useState(true);

  const [isNameSubmitVisible, setIsNameSubmitVisble] = useState(false);
  const [isEmailSubmitVisible, setIsEmailSubmitVisible] = useState(false);
  const [isDateOfBirthSubmitVisible, setIsDateOfBirthVisible] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // handle disabling and unlocking text fields
  const handleNameDisabled = () => {
    setIsNameSubmitVisble(!isNameSubmitVisible);
    setIsNameDisabled(!isNameDisabled);
  };

  const handleEmailDisabled = () => {
    setIsEmailSubmitVisible(!isEmailSubmitVisible);
    setIsEmailDisabled(!isEmailDisabled);
  };

  const handleDateOfBirthDisabled = () => {
    setIsDateOfBirthVisible(!isDateOfBirthSubmitVisible);
    setIsDateOfBirthDisabled(!isDateOfBirthDisabled);
  };

  // Handles image upload and formats it to Base64
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
                input
                disabled={isNameDisabled}
                onChange={(event) => setName(event.target.value)}
                type="text"
                placeholder={user.name}
                InputProps={{
                  endAdornment: (
                    <ButtonGroup position="end">
                      {isNameSubmitVisible ? (
                        <IconButton>
                          <DoneIcon />
                        </IconButton>
                      ) : null}
                      <IconButton onClick={handleNameDisabled}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </ButtonGroup>
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
                input
                disabled={isEmailDisabled}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder={user.email}
                InputProps={{
                  endAdornment: (
                    <ButtonGroup position="end">
                      {isEmailSubmitVisible ? (
                        <IconButton>
                          <DoneIcon />
                        </IconButton>
                      ) : null}
                      <IconButton onClick={handleEmailDisabled}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </ButtonGroup>
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
                input
                disabled={isDateOfBirthDisabled}
                onChange={(event) => setDateOfBirth(event.target.value)}
                type="date"
                placeholder={user.dateOfBirth}
                InputProps={{
                  endAdornment: (
                    <ButtonGroup position="end">
                      {isDateOfBirthSubmitVisible ? (
                        <IconButton>
                          <DoneIcon />
                        </IconButton>
                      ) : null}
                      <IconButton onClick={handleDateOfBirthDisabled}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </ButtonGroup>
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
