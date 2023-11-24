/**
 * Manage Group Members Modal component
 */

import {
  Modal,
  Box,
  InputAdornment,
  TextField,
  Autocomplete,
  Chip,
  CircularProgress,
  Avatar,
  Button,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import WorkspacesOutlinedIcon from "@mui/icons-material/WorkspacesOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import MemberChip from "../partial/MemberChip";
import { useNavigate } from "react-router";
import {
  addChannelMember,
  removeChannelMember,
  deleteChannel,
  getChannelInfo,
  updateChannelName,
} from "../../services/channelsAPI";

/**
 * Builds and renders the Manage Group Members Modal component
 * @returns Manage Members Modal component render
 */

const ManageChannelModal = ({
  manageChannelModalOpen,
  setManageChannelModalOpen,
  setRefresh,
  channelID,
  channels,
  group,
  groupReload,
  setGroupReload,
}) => {
  // Component state objects
  const [searchString, setSearchString] = useState("");
  const [channelName, setChannelName] = useState("");
  const [options, setOptions] = useState([]);
  const [channelOptions, setChannelOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [visibility, setVisibility] = useState("");

  const [members, setMembers] = useState([]);
  const loading = open && options.length === 0;

  const navigate = useNavigate();

  // Loading function (async)
  function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  // for setting / rendering channel infromation
  useEffect(() => async () => {
    if (channelID !== null && group.groupID !== null) {
      try {
        // get the current channel info
        const response = await getChannelInfo(group.groupID, channelID);

        // set channel visibility for channel member management
        setVisibility(response.Visibility);
        // setting the channel name in the input field
        setChannelName(response.ChannelName);
      } catch (err) {
      }
    }
  });

  // Methods
  // Handle channel member add
  const handleAddMember = async (option) => {
    try {
      // attempt to add channel member option
      const response = await addChannelMember(
        parseInt(group.groupID),
        channelID,
        option.AccountID
      );
      setGroupReload(!groupReload);

      // set up additional temp member for frontend view/func only.
      // Next time the modal is open it will have the exact elements
      const tempMembers = members;
      const newMember = {
        AccountID: option.AccountID,
        MemberName: option.MemberName,
        Role: "Member",
        avatar: option.avatar,
      };
      members.push(newMember);
      setMembers(tempMembers);
    } catch (err) {
    }
  };

  // Handle channel member remove
  const handleRemoveMember = async (member, i) => {
    try {
      const groupId = group.groupID;

      const response = await removeChannelMember(
        groupId,
        channelID,
        member.AccountID
      );
      setGroupReload(!groupReload);
      // Manually remove member for frontend view/func only.
      // Next time the modal is open it will have the exact elements pulled from backend
      const tempMembers = members;
      tempMembers.splice(i, 1);
      setMembers(tempMembers);
    } catch (err) {
    }
  };

  // handle updating the channel name
  async function updateChannelInfo(e) {
    e.preventDefault();
    try {
      const response = await updateChannelName(
        group.groupID,
        channelID,
        channelName
      );
      setGroupReload(!groupReload);
    } catch (err) {
    }
  }

  // delete channel handler method
  const deleteChannelHandler = async () => {
    try {
      const response = await deleteChannel(group.groupID, channelID);
      const groupID = group.groupID;
      setGroupReload(!groupReload);
      setManageChannelModalOpen(false);
      navigate(`/dashboard/groups/${groupID}`);
      //not sure entirely what I'd update here
    } catch (err) {
    }
  };

  // handle modal closing
  const handleClose = () => setManageChannelModalOpen(false);

  // Effects
  // get channel members
  // TODO fix continous loop of fetch channel members
  useEffect(() => {
    const fetchChannelMembers = async () => {
      if (group.groupID !== null && channelID !== null) {
        try {
          const response = await getChannelInfo(group.groupID, channelID);
          if (response.members) {
            setMembers(response.members);
          }

          setGroupReload(!groupReload);
        } catch (err) {
        }
      }
    };
    fetchChannelMembers();
  }, [channelID]);

  // calculate friend options
  useEffect(() => {
    // get only members who are not friends
    const notPossible = [];
    const groupMemberTemp = group.GroupMembers;

    // loop through groupmember temp and search for members
    groupMemberTemp.forEach((groupMember) => {
      members.forEach((member) => {
        if (groupMember.AccountID === member.AccountID) {
          notPossible.push(member);
        }
      });
    });

    // if members were found in notPossibleTemp
    const notPossibleTemp = groupMemberTemp.filter((groupMember) => {
      return !notPossible.some(
        (member) => member.AccountID === groupMember.AccountID
      );
    });
    // set the not possible temp
    setChannelOptions(notPossibleTemp);
  }, [
    manageChannelModalOpen,
    setMembers,
    groupReload,
    channelID,
    members,
    group.GroupMembers,
  ]);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...channelOptions]);
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

  return (
    <Modal
      id="manage-channels-modal-background"
      open={manageChannelModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box id="manage-channels-modal">
        <div id="manage-channel-modal-header">
          <h2>Manage Channel</h2>
        </div>

        <div id="manage-channel-settings-textfield">
          <form>
            <p id="channel-name-header">
              <WorkspacesOutlinedIcon />
              Channel Name
            </p>
            <TextField
              fullWidth
              id="channel-name-txtfield"
              variant="outlined"
              placeholder="Enter channel name..."
              value={channelName}
              onChange={(event) => setChannelName(event.target.value)}
            />
            <Button
              id="manage-channel-submit-button"
              variant="contained"
              type="submit"
              onClick={updateChannelInfo}
            >
              Save changes
            </Button>
          </form>
        </div>
        <div className="manage-channels-bottom">
          {visibility === "Private" ? (
            <div id="manage-channels-modal-private-container">
              <div id="manage-channels-modal-whitebox">
                {members &&
                  members.map((member, i) => {
                    return (
                      <MemberChip
                        key={i}
                        member={member}
                        request={false}
                        setRefresh={setRefresh}
                        setManageChannelModalOpen={setManageChannelModalOpen}
                        handleRemoveMember={() => handleRemoveMember(member, i)}
                      />
                    );
                  })}
              </div>

              <h3>Private Channel</h3>
              <div className="manage-channels-link">
                <PeopleAltOutlinedIcon />
                <p>Add member</p>
              </div>
              {channelOptions.length > 0 ? (
                <Autocomplete
                  disableCloseOnSelect
                  sx={{ width: "90%" }}
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
                        icon={
                          <Avatar src={option.avatar || option.MemberAvatar} />
                        }
                        className="friend-search-chip"
                        label={option.MemberName}
                        sx={{
                          width: "100%",
                          height: "fit-content",
                          borderRadius: "80px",
                          padding: "10px",
                        }}
                        deleteIcon={
                          <PersonAddOutlinedIcon className="add-friend-icon" />
                        }
                        onDelete={() => handleAddMember(option)}
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
                      placeholder="Add a new Channel member..."
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
                  sx={{ width: "90%" }}
                  id="manage-friends-searchbar"
                  variant="outlined"
                  placeholder="All possible channel members have been added"
                  inputProps={{ readOnly: true }}
                />
              )}
            </div>
          ) : (
            <div>
              <h3>Public Channel</h3>
            </div>
          )}

          <div className="channel-delete-bttn-container">
            <button
              id="channel-delete-bttn"
              className="channel-button"
              onClick={deleteChannelHandler}
            >
              <DeleteOutlineOutlinedIcon />
              <h3>Delete Channel</h3>
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

//Export the Manage Members Modal component
export default ManageChannelModal;
