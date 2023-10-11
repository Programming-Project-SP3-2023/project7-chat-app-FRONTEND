import { TextField, Avatar, Box, FormControl, Button } from "@mui/material";
import { Modal } from "@mui/material";
import { getUser, getUserID } from "../../utils/localStorage";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import ButtonGroup from "@mui/material/ButtonGroup";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import PasswordUpdateModal from "./PasswordUpdate";
import { updateAvatar, updateDisplayName } from "../../services/userAPI";

const EditProfile = ({ editProfileModalOpen, setEditProfileModalOpen }) => {
  const [user, setUser] = useState(getUser());
  const accountID = getUserID();

  // close modal
  const handleClose = () => {
    setMessage(null);
    setEditProfileModalOpen(false);
  };
  // by setting useState as(true) each text field is disabled initially
  const [isNameDisabled, setIsNameDisabled] = useState(true);
  const [isEmailDisabled, setIsEmailDisabled] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState(user && user.displayName);
  const [email, setEmail] = useState(user && user.email);
  const [message, setMessage] = useState(null);
  // loading state handler
  const [loading, setLoading] = useState(false);

  // always look for user state updates
  useEffect(() => {
    setUser(getUser());
  }, [loading, setLoading]);

  // handle disabling and unlocking text fields
  const handleNameDisabled = () => {
    // disables text field
    setIsNameDisabled(!isNameDisabled);
  };

  const handleEmailDisabled = () => {
    setIsEmailDisabled(!isEmailDisabled);
  };

  // Handles image upload and formats it to Base64
  const imageChange = (e) => {
    console.log(e.target.files);
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
    console.log("updating profile...");
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
        const updateAvatarResponse = await updateAvatar(
          accountID,
          selectedImage
        );
        console.log(updateAvatarResponse);
        setMessage(updateAvatarResponse);
      } catch (error) {
        console.log(error);
        setMessage("Unable to update your avatar.");
      }
    }

    // 3. Update display name
    try {
      const updateNameResponse = await updateDisplayName(accountID, name);
      console.log(updateNameResponse);
      setMessage(updateNameResponse);
    } catch (error) {
      console.log(error);
      setMessage("Unable to update your display name");
    } finally {
      //Disable loading state
      setLoading(false);
    }

    // 4. Update email
    // to do, waiting on backend functions - similar to display name
    
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
                    onChange={(event) => setEmail(event.target.value)}
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
                    onChange={(event) => setName(event.target.value)}
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
                </FormControl>
              </form>
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
