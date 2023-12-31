import {
  FormControl,
  TextField,
  Box,
  Button,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Modal } from "@mui/material";
import { useState } from "react";
import { updatePassword } from "../../services/userAPI";

const PasswordUpdateModal = ({ pwdUpdateOpen, setPwdUpdateOpen }) => {

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [successMsg, setsuccessMsg] = useState(null);


  const passwordUpdateHandler = async (event) => {
    event.preventDefault();

    if (
      (currentPassword === "") |
      (newPassword === "") |
      (repeatPassword === "")
    ) {
      setMessage("All Fields are required to update password");
    } else if (newPassword !== repeatPassword) {
      setMessage("New Password and repeat password do not match!");
    } else {
      // update users password
      try {
        const response = await updatePassword(currentPassword, newPassword);
        setsuccessMsg(response);
      } catch (err) {
        setMessage(err.response.data.message);
      }
    }
  };

  const handleClose = () => {
    setPwdUpdateOpen(false);
  };

  return (
    <>
      <Modal
        id="password-update-modal-background"
        open={pwdUpdateOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="password-update-modal">
          <div id="password-update-modal-header">
            <h3>Update Password</h3>
          </div>

          <form
            onSubmit={passwordUpdateHandler}
            id="password-update-modal-body"
          >
            <FormControl>
              {/* name */}
              <p>Current Password</p>
              {/* textfield with users name */}
              <TextField
                fullWidth
                id="currentPassword"
                variant="outlined"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Enter your current password."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
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
              {successMsg && <p className="success">{successMsg}</p>}
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
    </>
  );
};

export default PasswordUpdateModal;
