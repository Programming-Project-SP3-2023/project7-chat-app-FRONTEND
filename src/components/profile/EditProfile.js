import { TextField, Avatar, Box, FormControl } from "@mui/material";
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
  const [message, setMessage] = useState(null);

  // TODO on cancel revent to original default values in text fields

  // handle disabling and unlocking text fields
  const handleNameDisabled = () => {
    // changes visibility of submit button
    setIsNameSubmitVisble(!isNameSubmitVisible);
    // disables text field
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

  const nameUpdateHandler = (event) => {
    event.preventDefault();
    console.log("Name Update Handler");

    if (name === "") {
      setMessage("New name cannot be empty");
    } else {
      // update username
    }
  };

  const emailUpdateHandler = (event) => {
    event.preventDefault();
    console.log("Email Update Handler");
    if (email === "") {
      setMessage("New Email cannot be empty");
    } else {
      //  update user email
    }
  };
  const dateOfBirthUpdateHandler = (event) => {
    event.preventDefault();
    console.log("Date Of Birth Update Handler");
    if (dateOfBirth === "") {
      setMessage("New Date of Birth cannot be empty!");
    } else {
      // update user date of birth
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
              <form onSubmit={nameUpdateHandler}>
                <FormControl fullWidth>
                  {/* name */}
                  <p>Name</p>
                  {/* textfield with users name */}
                  <TextField
                    fullWidth
                    id="nameUpdate"
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
                            <IconButton type="submit">
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
                </FormControl>
              </form>
              <form onSubmit={emailUpdateHandler}>
                <FormControl fullWidth>
                  <p>Email</p>
                  {/* textfield with users email */}
                  <TextField
                    fullWidth
                    id="emailUpdate"
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
                            <IconButton type="submit">
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
                </FormControl>
              </form>
              <form onSubmit={dateOfBirthUpdateHandler}>
                <FormControl fullWidth>
                  <p>Date of Birth</p>
                  {/* textfield with users date of birth */}
                  <TextField
                    fullWidth
                    id="dateOfBirthUpdate"
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
                            <IconButton type="submit">
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
                </FormControl>
              </form>
              {message && <p className="error-message">{message}</p>}
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
