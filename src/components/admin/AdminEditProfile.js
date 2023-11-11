import { TextField, Avatar, Box, FormControl, Button } from "@mui/material";
import { Modal } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { updateAccount } from "../../services/adminAPI";

const AdminEditProfile = ({
  adminEditProfileModalOpen,
  setAdminEditProfileModalOpen,
  user,
  setRefresh,
  refresh,
}) => {
  const [userImg, setUserImg] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [ID, setID] = useState(null);
  const [DOB, setDOB] = useState(null);
  const [message, setMessage] = useState(null);
  // loading state handler
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserImg(user.Avatar);
    setName(user.DisplayName);
    setEmail(user.Email);
    setDOB(user.Dob);
    setID(user.AccountID);
  }, [user]);

  // close modal
  const handleClose = () => {
    setMessage(null);
    setUserImg(null);
    setName(null);
    setEmail(null);
    setDOB(null);
    setID(null);
    setAdminEditProfileModalOpen(false);
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

    if (DOB === "") {
      setMessage("DOB field cannot be empty");
      return;
    }

    // 3. Update Req TODO
    const requestBody = {
      AccountID: ID,
      Email: email,
      DisplayName: name,
      Dob: DOB,
      Avatar: selectedImage ? selectedImage : userImg,
    };

    try {
      const response = await updateAccount(requestBody);
      console.log(response);
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }

    //Disable loading state
    setLoading(false);
    handleClose();
  };

  return (
    <div>
      <Modal
        id="edit-profile-modal-background"
        open={adminEditProfileModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="edit-profile-modal">
          <div id="edit-profile-modal-header">
            <h3>Edit User {ID}</h3>
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
                <Avatar id="edit-profile-avatar" alt={name}>
                  <div id="edit-avatar-upload-box">
                    {!selectedImage && !userImg && <PersonOutlineIcon />}
                    {!selectedImage && userImg && (
                      <img src={userImg} alt="Profile" />
                    )}
                    {selectedImage && <img src={selectedImage} />}
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
                    onChange={(event) => setEmail(event.target.value)}
                    type="text"
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
                    onChange={(event) => setName(event.target.value)}
                    type="text"
                  />
                  <p>Date of Birth</p>
                  {/* textfield with users date of birth */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    onChange={(event) => setDOB(event.target.value)}
                    value={dayjs(DOB).format("YYYY-MM-DD")}
                    type="date"
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
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminEditProfile;
