import {
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

  const passwordUpdateHandler = async () => {

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
      const response = await updatePassword(user.AccountID, newPassword);
      setMessage("Users password has been updated.");
      handleClose();
    } catch (err) {
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
        {/* textfield with users email */}
        <TextField
          sx={{width:"90%", marginTop:"15px"}}
          id="newPassword"
          variant="outlined"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Enter new password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
        {/* textfield with users date of birth */}
        <TextField
          sx={{width:"90%", marginTop:"15px"}}
          id="repeatPassword"
          variant="outlined"
          type="password"
          value={repeatPassword}
          onChange={(event) => setRepeatPassword(event.target.value)}
          placeholder="Enter new password again."
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
            onClick={passwordUpdateHandler}
          >
            Update
          </Button>
        </div>
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
