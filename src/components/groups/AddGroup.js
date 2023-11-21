/**
 * Add Group component
 */

import {
  Modal,
  Box,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
  InputAdornment,
  Chip,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { addGroupMember, createGroup } from "../../services/groupsAPI";
/**
 * Builds and renders the Add Group component
 * @returns Add Group component render
 */

const AddGroup = ({
  groupModalOpen,
  setGroupModalOpen,
  friends,
  groupID,
  groupReload,
  setGroupReload,
}) => {
  // state variables for modal
  const [selectedImage, setSelectedImage] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [searchString, setSearchString] = useState("");
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [newMembers, setNewMembers] = useState([]);
  const [friendOptions, setFriendOptions] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [successMsg, setSuccesMsg] = useState(null);
  const loading = open && options.length === 0;

  // METHODS

  // Loading function (async)
  function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  // Effects
  useEffect(() => {
    setFriendOptions(friends);
  }, []);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...friendOptions]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  // handle modal closing
  const handleClose = () => setGroupModalOpen(false);

  // Handle friend add
  const handleAddMember = (option) => {
    // 1. add member to new members array
    const temp = newMembers;
    temp.push(option);
    console.log("NEW MEMBERS", temp);
    setNewMembers(temp);

    // 2. remove members from the potential members array
    let indexToRemove;
    for (let i = 0; i < friendOptions.length; i++) {
      if (friendOptions[i] === option) {
        indexToRemove = i;
        break;
      }
    }
    const tempOpt = friendOptions;
    tempOpt.splice(indexToRemove, 1);

    setFriendOptions(tempOpt);

    // 3. close dropdown
    setOpen(false);
  };

  // handles image change and file upload (base64)
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const data = new FileReader();
      data.addEventListener("load", () => {
        setSelectedImage(data.result);
      });
      data.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreateGroup = async () => {
    setProcessing(true);
    const requestBody = {
      groupName: groupName,
      groupAvatar: selectedImage,
    };

    try {
      const response = await createGroup(requestBody);
      console.log(response.data.message);
      const groupID = response.data.groupID;

      if (newMembers.length > 0) {
        newMembers.forEach(async (member) => {
          let newMemberRes = await addGroupMember(groupID, member.Email);
          console.log(newMemberRes);
        });
      }
      setGroupReload(!groupReload);
      setProcessing(false);
      setSuccesMsg("Group Successfully Created!");
    } catch (err) {
      console.log(err);
      setMessage("Something went wrong. We were unable to create the group.");
      setProcessing(false);
    }
  };

  return (
    <Modal
      id="add-group-modal-background"
      open={groupModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="add-group-modal">
        <div id="add-group-modal-header">
          <h2>New Group</h2>
        </div>
        {processing ? (
          <CircularProgress size={100} />
        ) : (
          <form id="add-group-modal-body">
            <div className="add-group-img-box">
              <label>
                <input
                  id="add-group-img-input"
                  accept="image/*"
                  type="file"
                  onChange={imageChange}
                />
                <div id="img-upload-box">
                  {!selectedImage ? (
                    <AddPhotoAlternateOutlinedIcon />
                  ) : (
                    <img src={selectedImage} alt="Uploaded Event" />
                  )}
                </div>
              </label>
            </div>
            <TextField
              fullWidth
              id="group-name-txtfield"
              variant="outlined"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
            />
            <div className="manage-friends-bottom">
              {friendOptions && friendOptions.length > 0 ? (
                <Autocomplete
                  sx={{ width: "100%" }}
                  open={open}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.DisplayName === value.name
                  }
                  getOptionLabel={(option) => option.DisplayName}
                  renderOption={(props, option) => (
                    <li>
                      <Chip
                        clickable
                        key={option}
                        icon={<Avatar src={option.Avatar} />}
                        className="friend-search-chip"
                        label={option.DisplayName}
                        sx={{
                          width: "100%",
                          height: "fit-content",
                          borderRadius: "80px",
                          padding: "10px",
                        }}
                        onClick={() => handleAddMember(option)}
                      />
                    </li>
                  )}
                  options={options}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="manage-friends-searchbar"
                      variant="outlined"
                      placeholder="Add a new group member..."
                      value={searchString}
                      onChange={(event) => setSearchString(event.target.value)}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : (
                              <InputAdornment position="end">
                                <SearchIcon color="primary" />
                              </InputAdornment>
                            )}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              ) : (
                <TextField
                  sx={{ width: "100%" }}
                  id="manage-friends-searchbar"
                  variant="outlined"
                  placeholder="You have already added all your friends"
                  inputProps={{ readOnly: true }}
                />
              )}
            </div>
            {newMembers.length > 0 && (
              <>
                <h3>Group members:</h3>
                <div id="group-members-container">
                  {newMembers.map((member) => (
                    <div className="group-member-icon">
                      <Avatar src={member.Avatar} />
                      <p>{member.DisplayName}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            <Button
              id="add-group-bttn"
              variant="contained"
              onClick={handleCreateGroup}
            >
              Create Group
            </Button>
            {message && <p className="error-message">{message}</p>}
            {successMsg && <p className="success">{successMsg}</p>}
          </form>
        )}
      </Box>
    </Modal>
  );
};

//Export the Add Group component
export default AddGroup;
