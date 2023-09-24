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
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

function AvatarUpdateModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [currentAvatar, setCurrentAvatar] = useState("");
  const [newAvatar, setNewAvatar] = useState("");

  return (
    <div>
      <IconButton onClick={handleOpen}>{<EditIcon />}</IconButton>
      <Modal
        id="avatar-update-modal-background"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="avatar-update-modal">
          <div id="avatar-update-modal-header">
            <h3>Update Avatar</h3>
          </div>
          <div>
            <form id="avatar-update-modal-body">
              <FormControl id="avatar-update-form">
                {/* name */}
                <p>New Avatar</p>
                {/* textfield with users name */}
                <TextField
                  fullWidth
                  id="avatar-update"
                  variant="outlined"
                  type="file"
                  onChange={(event) => setNewAvatar(event.target.files[0])}
                  placeholder="Please select your new Avatar"
                  InputProps={{
                    // TODO figure out why this does not work
                    accept: "images/*",
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
            <div id="avatar-update-modal-btn-container">
              <div>
                <Button
                  variant="contained"
                  id="update-avatar-btn"
                  type="submit"
                >
                  Update
                </Button>
              </div>
              <div>
                <Button onClick={handleClose}>Cancel</Button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default AvatarUpdateModal;
