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
  const [isUsernameDisabled, setIsUsernameDisabled] = useState(true);
  // TODO remove
  // const [isEmailDisabled, setIsEmailDisabled] = useState(true);
  // const [isDateOfBirthDisabled, setIsDateOfBirthDisabled] = useState(true);

  const [isNameSubmitVisible, setIsNameSubmitVisble] = useState(false);
  const [isUsernameSubmitVisible, setIsUsernameSubmitVisible] = useState(false);
  // TODO remove
  // const [isEmailSubmitVisible, setIsEmailSubmitVisible] = useState(false);
  // const [isDateOfBirthSubmitVisible, setIsDateOfBirthVisible] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [message, setMessage] = useState(null);

  // handle disabling and unlocking text fields
  const handleNameDisabled = () => {
    // changes visibility of submit button
    setIsNameSubmitVisble(!isNameSubmitVisible);
    // disables text field
    setIsNameDisabled(!isNameDisabled);
  };

  const handleUsernameDisabled = () => {
    setIsUsernameSubmitVisible(!isUsernameSubmitVisible);
    setIsUsernameDisabled(!isUsernameDisabled);
  };

  // TODO remove
  // const handleEmailDisabled = () => {
  //   setIsEmailSubmitVisible(!isEmailSubmitVisible);
  //   setIsEmailDisabled(!isEmailDisabled);
  // };

  // const handleDateOfBirthDisabled = () => {
  //   setIsDateOfBirthVisible(!isDateOfBirthSubmitVisible);
  //   setIsDateOfBirthDisabled(!isDateOfBirthDisabled);
  // };

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

  const usernameUpdateHandler = (event) => {
    event.preventDefault();
    console.log("Username update hanlder");

    if (username === "") {
      setMessage("Username cannot be empty");
    } else {
      user.username = username;
      setIsUsernameDisabled(!isUsernameDisabled);
      setIsUsernameSubmitVisible(!isUsernameSubmitVisible);
      setMessage("username: " + user.username + " has been updated.");
      // update username.
    }
  };

  const nameUpdateHandler = (event) => {
    event.preventDefault();
    console.log("Name Update Handler");

    if (name === "") {
      setMessage("New name cannot be empty");
    } else {
      // update username
      user.name = name;
      setIsNameDisabled(!isNameDisabled);
      setIsNameSubmitVisble(!isNameSubmitVisible);
      setMessage("name: " + user.name + " has been updated");
      // update name
    }
  };

  // TODO removing
  // const emailUpdateHandler = (event) => {
  //   event.preventDefault();
  //   console.log("Email Update Handler");
  //   if (email === "") {
  //     setMessage("New Email cannot be empty");
  //   } else {
  //     //  update user email
  //   }
  // };

  // TODO removing
  // const dateOfBirthUpdateHandler = (event) => {
  //   event.preventDefault();
  //   console.log("Date Of Birth Update Handler");
  //   if (dateOfBirth === "") {
  //     setMessage("New Date of Birth cannot be empty!");
  //   } else {
  //     // update user date of birth
  //   }
  // };

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
              {/* ------------------------------- USERNAME ------------------------- */}
              <form onSubmit={usernameUpdateHandler}>
                <FormControl fullWidth>
                  {/* name */}
                  <p>Username:</p>
                  {/* textfield with users name */}
                  <TextField
                    fullWidth
                    id="usernameUpdate"
                    variant="outlined"
                    value={username}
                    input
                    disabled={isUsernameDisabled}
                    onChange={(event) => setUsername(event.target.value)}
                    type="text"
                    placeholder={user && user.username}
                    InputProps={{
                      endAdornment: (
                        <ButtonGroup position="end">
                          {isUsernameSubmitVisible ? (
                            <IconButton type="submit">
                              <DoneIcon />
                            </IconButton>
                          ) : null}
                          <IconButton onClick={handleUsernameDisabled}>
                            <EditIcon color="primary" />
                          </IconButton>
                        </ButtonGroup>
                      ),
                    }}
                  />
                </FormControl>
              </form>
              {/* ------------------------ NAME -------------------- */}
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
                    placeholder={user && user.name}
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
              {/* TODO remove */}
              {/* <form onSubmit={emailUpdateHandler}> */}
              {/* <FormControl fullWidth> */}
              <p>Email</p>
              {/* textfield with users email */}
              <TextField
                fullWidth
                id="emailUpdate"
                variant="outlined"
                value={email}
                input
                disabled="true"
                // onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder={user && user.email}
                // TODO remove
                // InputProps={{
                //   endAdornment: (
                //     <ButtonGroup position="end">
                //       {isEmailSubmitVisible ? (
                //         <IconButton type="submit">
                //           <DoneIcon />
                //         </IconButton>
                //       ) : null}
                //       <IconButton onClick={handleEmailDisabled}>
                //         <EditIcon color="primary" />
                //       </IconButton>
                //     </ButtonGroup>
                //   ),
                // }}
              />
              {/* </FormControl> */}
              {/* </form> */}

              <p>Date of Birth</p>
              {/* textfield with users date of birth */}
              <TextField
                fullWidth
                id="dateOfBirthUpdate"
                variant="outlined"
                value={dateOfBirth}
                input
                disabled="true"
                type="date"
                placeholder={user && user.dateOfBirth}
              />

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
