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
  const [groupMembersOptions, setGroupMemberOptions] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const loading = open && options.length === 0;

  // by default the channel type is text unless the user changes the toggle
  const [messageType, setMessageType] = React.useState("Chat");
  const [visibility, setVisibility] = useState("Public");

  // handle channel type selection
  const handleChange = (event, newMessageType) => {
    // prevent the user from selecting a null type of channel
    if (newMessageType !== null) {
      setMessageType(newMessageType);
    }
  };

  const handleVisibility = (event, newVisibilityType) => {
    if (newVisibilityType !== null) {
      setVisibility(newVisibilityType);
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
    //console.log("groupmember options...", group.GroupMembers);
    setGroupMemberOptions(group.GroupMembers);
  }, [groupMembersOptions]);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...groupMembersOptions]);
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
  const handleClose = () => {
    setManageAddChannelModalOpen(false);
    setNewMembers([]);
    setGroupMemberOptions([]);
  };

  //console.log("groupdMember options...", groupMembersOptions);
  // Handle friend add
  const handleAddMember = (option) => {
    // 1. add member to new members array

    let temp = newMembers;
    temp.push(option);
    console.log("NEW MEMBERS", temp);
    setNewMembers(temp);

    // 2. remove members from the potential members array
    let indexToRemove;
    for (let i = 0; i < groupMembersOptions.length; i++) {
      if (groupMembersOptions[i] === option) {
        indexToRemove = i;
        break;
      }
    }
    let tempOpt = groupMembersOptions;
    tempOpt.splice(indexToRemove, 1);

    setGroupMemberOptions(tempOpt);
    //console.log("tempOpt", tempOpt);
    // 3. close dropdown
    setOpen(false);
  };

  //  console.log("message type: ", messageType);
  //  console.log("channelName: ", channelName);

  // handle create channel
  const handleCreateChannel = async () => {
    if (channelName.trim() === "") {
      setMessage("Channel Name cannot be empty");

      // TODO add method to loop through channel list for same name
    } else {
      setProcessing(true);
      try {
        const groupId = group.groupID;

        const response = await createChannel(
          groupId,
          messageType,
          visibility,
          channelName
        );
        console.log("the Response", response.data.message);

        //TODO verify what information is required for the create

        const groupID = group.groupID;

        const channelId = response.data.channelId;

        console.log("channelID....", channelId);

        if (newMembers.length > 0 && visibility === "Private") {
          newMembers.forEach(async (member) => {
            let newMemberRes = await addChannelMember(
              groupID,
              channelId,
              member.accountID
            );
            console.log(newMemberRes);
          });
        }
        setGroupReload(!groupReload);
        setProcessing(false);
        setManageAddChannelModalOpen(false);
        navigate(`/dashboard/groups/${group.groupdID}`);
        // clear fields after creation
        setNewMembers([]);
        setGroupMemberOptions([]);
        console.log("the Response", response);
      } catch (err) {
        console.log(err);
        setMessage(
          "Something went wrong. We were unable to create the channel."
        );
        setProcessing(false);
      }
    }
  };

  return (
    <Modal
      id="add-channel-modal-background"
      open={manageAddChannelModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="add-channel-modal">
        <div id="add-channel-modal-header">
          <h2>New Channel</h2>
        </div>
        {processing ? (
          <CircularProgress size={100} />
        ) : (
          <form id="add-channel-modal-body">
            <TextField
              fullWidth
              id="channel-name-txtfield"
              placeholder="Enter channel name..."
              value={channelName}
              onChange={(event) => setChannelName(event.target.value)}
            />
            {visibility === "Private" ? (
              <div className="manage-channel-bottom-container">
                <div className="manage-channel-bottom">
                  {groupMembersOptions && groupMembersOptions.length > 0 ? (
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
                            icon={<Avatar src={option.avatar} />}
                            className="friend-search-chip"
                            label={option.MemberName}
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
                          id="manage-channel-searchbar"
                          variant="outlined"
                          placeholder="Add a new channel member..."
                          value={searchString}
                          onChange={(event) =>
                            setSearchString(event.target.value)
                          }
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
                      id="manage-channel-searchbar"
                      variant="outlined"
                      placeholder="All your Available group members have been added"
                      inputProps={{ readOnly: true }}
                    />
                  )}
                </div>
                {newMembers.length > 0 && (
                  <>
                    <h3>Channel members:</h3>
                    <div id="channel-members-container">
                      {newMembers.map((member) => (
                        <div className="channel-member-icon">
                          <Avatar src={member.avatar} />
                          <p>{member.MemberName}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div></div>
            )}

            <div className="toggle-buttons-group">
              <h3>Channel Type:</h3>
              <div className="channel-toggle-select">
                <ToggleButtonGroup
                  color="primary"
                  value={messageType}
                  exclusive
                  onChange={handleChange}
                  aria-label="Platform"
                >
                  <ToggleButton className="channel-toggle-btn" value="Chat">
                    Message
                  </ToggleButton>
                  <ToggleButton className="channel-toggle-btn" value="Voice">
                    Voice Chat
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              <h3>Channel Visibility</h3>
              <div className="channel-toggle-select">
                <ToggleButtonGroup
                  color="primary"
                  value={visibility}
                  exclusive
                  onChange={handleVisibility}
                  aria-label="Platform"
                  id="channel-visibility-toggle"
                >
                  <ToggleButton className="channel-toggle-btn" value="Public">
                    Public
                  </ToggleButton>
                  <ToggleButton className="channel-toggle-btn" value="Private">
                    Private
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
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
