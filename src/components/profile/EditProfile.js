import { TextField, Avatar, Box, FormControl, Button } from "@mui/material";
import { Modal } from "@mui/material";
import {
  getAccessToken,
  getUser,
  getUserID,
  resetUserSession,
  setUserSession,
} from "../../utils/localStorage";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import ButtonGroup from "@mui/material/ButtonGroup";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import {
  getUserByID,
  updateAvatar,
  updateDisplayName,
  updateEmail,
} from "../../services/userAPI";

const EditProfile = ({ editProfileModalOpen, setEditProfileModalOpen }) => {
  const [user, setUser] = useState(getUser());

  // close modal
  const handleClose = () => {
    setMessage(null);
    setEditProfileModalOpen(false);
  };
  // by setting useState as(true) each text field is disabled initially
  const [isNameDisabled, setIsNameDisabled] = useState(true);
  const [isEmailDisabled, setIsEmailDisabled] = useState(true);

  // update flags - turned on when a field is changed, they trigger API update
  const [emailChange, setEmailChange] = useState(false);
  const [nameChange, setNameChange] = useState(false);

  const [userImg, setUserImg] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [message, setMessage] = useState(null);
  const [successMsg, setSuccesMsg] = useState(null);
  // loading state handler
  const [loading, setLoading] = useState(false);

  // handle disabling and unlocking text fields
  const handleNameDisabled = () => {
    // disables text field
    setIsNameDisabled(!isNameDisabled);
  };

  const handleEmailDisabled = () => {
    setIsEmailDisabled(!isEmailDisabled);
  };

  useEffect(() => {
    if (user && user.image !== "NULL") {
      setUserImg(user.image);
    }

    if (user) {
      setName(user.displayName);
      setEmail(user.email);
    }
  }, []);

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

  // update profile handler
  const updateProfile = async (event) => {
    event.preventDefault();
    setLoading(true);

    // 1. validation checks
    if (name === "") {
      setMessage("Name field cannot be empty");
      return;
    }

    if (email === "") {
      setMessage("Email field cannot be empty");
      return;
    }

    // 2. If an image has been uploaded, trigger avatar update req
    if (selectedImage) {
      try {
        const updateAvatarResponse = await updateAvatar(selectedImage);
        setSuccesMsg("Account details updated successfully!");
      } catch (error) {
        setMessage("Unable to update your avatar.");
        setSuccesMsg(null);
      }
    }

    // 3. Update display name
    if (nameChange) {
      try {
        const updateNameResponse = await updateDisplayName(name);
        setSuccesMsg("Account details updated successfully!");
      } catch (error) {
        setMessage("Unable to update your display name");
        setSuccesMsg(null);
      }
    }

    // 4. Update email
    if (emailChange) {
      try {
        const updateEmailResponse = await updateEmail(email);
        setSuccesMsg("Account details updated successfully!");
      } catch (error) {
        setMessage("Unable to update your email address");
        setSuccesMsg(null);
      }
    }

    // 5. Update user info
    try {
      const userDataResponse = await getUserByID(getUserID(), getAccessToken());

      let updatedUser;
      if (selectedImage) {
        updatedUser = {
          email: userDataResponse.email,
          displayName: userDataResponse.displayName,
          dob: userDataResponse.dob,
          username: userDataResponse.username,
          image: selectedImage,
        };
      } else {
        updatedUser = {
          email: userDataResponse.email,
          displayName: userDataResponse.displayName,
          dob: userDataResponse.dob,
          username: userDataResponse.username,
          image: userImg,
        };
      }
      resetUserSession();
      setUserSession(updatedUser);
    } catch (error) {
    }

    //Disable loading state
    setLoading(false);
    setIsNameDisabled(!isNameDisabled);
    setIsEmailDisabled(!isEmailDisabled);
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
                    {!selectedImage && !userImg && <PersonOutlineIcon />}
                    {!selectedImage && userImg && (
                      <img src={userImg} alt="Profile - 2" />
                    )}
                    {selectedImage && (
                      <img src={selectedImage} alt="Profile - 3" />
                    )}
                  </div>
                </Avatar>
              </label>
            </div>
            <div id="edit-profile-modal-textfields-container">
              {/* ------------------------------- EMAIL ------------------------- */}
              <form onSubmit={updateProfile}>
                <FormControl fullWidth>
                  {/* email */}
                  <p>Email:</p>
                  {/* textfield with users name */}
                  <TextField
                    fullWidth
                    id="emailUpdate"
                    variant="outlined"
                    value={email}
                    disabled={isEmailDisabled}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setEmailChange(true);
                    }}
                    type="text"
                    placeholder="User email"
                    InputProps={{
                      endAdornment: (
                        <ButtonGroup position="end">
                          <IconButton onClick={handleEmailDisabled}>
                            <EditIcon color="primary" />
                          </IconButton>
                        </ButtonGroup>
                      ),
                    }}
                  />

                  {/* ------------------------ NAME -------------------- */}
                  {/* name */}
                  <p>Name</p>
                  {/* textfield with users name */}
                  <TextField
                    fullWidth
                    id="nameUpdate"
                    variant="outlined"
                    value={name}
                    disabled={isNameDisabled}
                    onChange={(event) => {
                      setName(event.target.value);
                      setNameChange(true);
                    }}
                    type="text"
                    placeholder="User Display Name"
                    InputProps={{
                      endAdornment: (
                        <ButtonGroup position="end">
                          <IconButton onClick={handleNameDisabled}>
                            <EditIcon color="primary" />
                          </IconButton>
                        </ButtonGroup>
                      ),
                    }}
                  />

                  <p>Username</p>
                  {/* textfield with user's username */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={user && user.username}
                    type="text"
                    placeholder="Username"
                    inputProps={{ readOnly: true }}
                  />
                  <p>Date of Birth</p>
                  {/* textfield with users date of birth */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={user && dayjs(user.dob).format("YYYY-MM-DD")}
                    type="date"
                    inputProps={{ readOnly: true }}
                  />
                  <Button
                    id="edit-profile-submit-button"
                    variant="contained"
                    type="submit"
                  >
                    Save changes
                  </Button>
                  {message && <p className="error-message">{message}</p>}
                  {successMsg && <p className="success">{successMsg}</p>}
                </FormControl>
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default EditProfile;
