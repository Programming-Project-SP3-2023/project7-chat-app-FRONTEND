import {
  FormControl,
  TextField,
  Box,
  Button,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { updatePassword } from "../../services/adminAPI";

const AdminPasswordUpdate = ({
  selectedUser,
  passwordUpdateOpen,
  setPasswordUpdateOpen,
  refresh,
  setRefresh,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(selectedUser);

  useEffect(() => {
    setUser(selectedUser);
  }, [selectedUser]);

  // handle modal closing
  const handleClose = () => {
    setUser({});
    setPasswordUpdateOpen(false);
    setRefresh(!refresh);
  };

  const passwordUpdateHandler = async (event) => {
    event.preventDefault();
    console.log("Password Update Handler");

    // 1. validate
    if (newPassword === "" || repeatPassword === "") {
      setMessage("All Fields are required to update password");
      return;
    }
    if (newPassword !== repeatPassword) {
      setMessage("New Password and repeat password do not match!");
      return;
    }

    // 2. update user password
    try {
      console.log("NEW", newPassword, user.AccountID);
      const response = await updatePassword(user.AccountID, newPassword);
      console.log(response);
      setMessage("Users password has been updated.");
      handleClose();
    } catch (err) {
      console.log(err);
      setMessage("An error occurred while trying to update this password.");
    }
  };

  return (
    <Modal
      id="password-update-modal-background"
      open={passwordUpdateOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box id="password-update-modal">
        <div id="password-update-modal-header">
          <h3>Update Password for Account {user.AccountID}</h3>
        </div>

        <form onSubmit={passwordUpdateHandler} id="password-update-modal-body">
          <FormControl>
            <p>New Password</p>
            {/* textfield with users email */}
            <TextField
              fullWidth
              id="newPassword"
              variant="outlined"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Enter your new password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <p>Repeat Password</p>
            {/* textfield with users date of birth */}
            <TextField
              fullWidth
              id="repeatPassword"
              variant="outlined"
              type="password"
              value={repeatPassword}
              onChange={(event) => setRepeatPassword(event.target.value)}
              placeholder="Enter your new Password again."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            {/* change password button/modal/dialog box */}
            {/* if the message is defined, show it */}
            {message && <p className="error-message">{message}</p>}
            <div id="password-update-modal-btn-container">
              <Button
                variant="contained"
                id="update-password-btn"
                type="submit"
              >
                Update
              </Button>
            </div>
          </FormControl>
        </form>
        <div id="password-update-modal-btn-container">
          <Button id="cancel-password-modal-btn" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default AdminPasswordUpdate;
