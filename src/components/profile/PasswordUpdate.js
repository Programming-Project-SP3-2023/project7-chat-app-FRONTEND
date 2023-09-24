import {
  FormControl,
  TextField,
  Box,
  Button,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Modal } from "@mui/material";
import React, { useState } from "react";

function PasswordUpdateModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [currentPassword, setCurrenPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  return (
    <div>
      <Button onClick={handleOpen}>
        <LockOutlinedIcon />
        Change Password
      </Button>
      <Modal
        id="password-update-modal-background"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="password-update-modal">
          <div id="password-update-header">
            <h2>Update Password</h2>
          </div>
          <form>
            <FormControl id="update-password-form">
              {/* name */}
              <p>Current Password</p>
              {/* textfield with users name */}
              <TextField
                fullWidth
                id="currentPassword"
                variant="outlined"
                type="password"
                onChange={(event) => setCurrenPassword(event.target.value)}
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
                onChnage={(event) => setRepeatPassword(event.target.value)}
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
            </FormControl>
          </form>
          <div>
            <Button>Submit</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default PasswordUpdateModal;