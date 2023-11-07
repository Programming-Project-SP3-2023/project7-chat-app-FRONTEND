/**
 * Add Group component
 */

import React from "react";

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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

// TODO channel member services api
import { addChannelMember, createChannel } from "../../services/channelsAPI";
import { useNavigate } from "react-router";
/**
 * Builds and renders the Add Group component
 * @returns Add Group component render
 */

const AddChannelModal = ({
  manageAddChannelModalOpen,
  setManageAddChannelModalOpen,
  friends,
  group,
  groupReload,
  setGroupReload,
}) => {
  // state variables for modal
  // const [selectedImage, setSelectedImage] = useState(null);
  const [channelName, setChannelName] = useState("");
  const [searchString, setSearchString] = useState("");
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [newMembers, setNewMembers] = useState([]);
  const [friendOptions, setFriendOptions] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const loading = open && options.length === 0;

  // by default the channel type is text unless the user changes the toggle
  const [messageType, setMessageType] = React.useState("text");

  // handle channel type selection
  const handleChange = (event, newMessageType) => {
    // prevent the user from selecting a null type of channel
    if (newMessageType !== null) {
      setMessageType(newMessageType);
    }
  };

  const navigate = useNavigate();

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
  const handleClose = () => setManageAddChannelModalOpen(false);

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

  console.log("message type: ", messageType);
  console.log("channelName: ", channelName);

  // handle create channel
  const handleCreateChannel = async () => {
    setProcessing(true);
    const requestBody = {
      // i'm guessing it'll need group & channel id
      groupdID: group.groupID,
      channelName: channelName,
      channelType: messageType,
    };

    try {
      const response = await createChannel(requestBody);
      console.log(response.data.message);
      //TODO verify what information is required for the create
      const groupID = response.data.groupID;
      const channelID = response.data.channelID;

      if (newMembers.length > 0) {
        newMembers.forEach(async (member) => {
          let newMemberRes = await addChannelMember(
            groupID,
            channelID,
            member.Email
          );
          console.log(newMemberRes);
        });
      }
      setGroupReload(!groupReload);
      setProcessing(false);
      setManageAddChannelModalOpen(false);
      navigate(`/dashboard/groups/${group.groupdID}`);
    } catch (err) {
      console.log(err);
      setMessage("Something went wrong. We were unable to create the channel.");
      setProcessing(false);
    }
  };

  return (
    <Modal
      id="add-group-modal-background"
      open={manageAddChannelModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="add-group-modal">
        <div id="add-group-modal-header">
          <h2>New Channel</h2>
        </div>
        {processing ? (
          <CircularProgress size={100} />
        ) : (
          <form id="add-group-modal-body">
            <TextField
              fullWidth
              id="group-name-txtfield"
              variant="outlined"
              placeholder="Enter channel name..."
              value={channelName}
              onChange={(event) => setChannelName(event.target.value)}
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
                      placeholder="Add a new channel member..."
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
            <h3>Channel Type:</h3>
            <div>
              <ToggleButtonGroup
                color="primary"
                value={messageType}
                variant="contained"
                exclusive
                onChange={handleChange}
                aria-label="Platform"
              >
                <ToggleButton value="text">Message</ToggleButton>
                <ToggleButton value="voice">Voice Chat</ToggleButton>
              </ToggleButtonGroup>
            </div>

            <Button
              id="add-group-bttn"
              variant="contained"
              onClick={handleCreateChannel}
            >
              Create Channel
            </Button>
            {message && <p className="error-message">{message}</p>}
          </form>
        )}
      </Box>
    </Modal>
  );
};

//Export the Add Group component
export default AddChannelModal;
