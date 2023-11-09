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
import { getUserID } from "../../utils/localStorage";
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
  friends,
  setRefresh,
  channelID,
  group,
  groupReload,
  setGroupReload,
}) => {
  // Component state objects
  const [searchString, setSearchString] = useState("");
  const [channelName, setChannelName] = useState("");
  const [options, setOptions] = useState([]);
  const [friendOptions, setFriendOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [friendToAdd, setFriendToAdd] = useState(null);
  const [members, setMembers] = useState([]);
  const loading = open && options.length === 0;
  const userId = getUserID();
  // Loading function (async)
  function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  console.log("group id...", group.groupID);
  console.log("channel id...", channelID);

  // Methods
  // Handle member add
  const handleAddMember = async (option) => {
    console.log("adding member...");
    try {
      const response = await addChannelMember(
        group.groupID,
        channelID,
        option.Email
      );
      console.log(response);
      setGroupReload(!groupReload);

      // set up additional temp member for frontend view/func only.
      // Next time the modal is open it will have the exact elements
      const tempMembers = members;
      const newMember = {
        AccountID: option.AccountID,
        MemberName: option.DisplayName,
        Role: "Member",
        avatar: option.Avatar,
      };
      members.push(newMember);
      setMembers(tempMembers);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle member remove
  const handleRemoveMember = async (member, i) => {
    console.log("removing member...");
    try {
      const response = await removeChannelMember(
        group.groupID,
        channelID,
        member.AccountID
      );
      console.log(response);
      setGroupReload(!groupReload);
      // Manually remove member for frontend view/func only.
      // Next time the modal is open it will have the exact elements pulled from backend
      const tempMembers = members;
      tempMembers.splice(i, 1);
      setMembers(tempMembers);
    } catch (err) {
      console.log(err);
    }
  };

  // handle updating the channel name
  async function updateChannelInfo(e) {
    e.preventDefault();
    try {
      const response = await updateChannelName(channelID, channelName);
      console.log(response);
      setGroupReload(!groupReload);
    } catch (err) {
      console.log(err);
    }
  }

  const deleteChannelHandler = async () => {
    const groupID = group.groupID;

    console.log("step 1 to delete channel....", channelID, "group", groupID);
    try {
      const response = await deleteChannel(groupID, channelID);
      console.log(response);
      setGroupReload(!groupReload);
      //not sure entirely what I'd update here
    } catch (err) {
      console.log(err);
    }
  };

  // handle modal closing
  const handleClose = () => setManageChannelModalOpen(false);

  // Effects
  // get channel members
  // TODO fix continous loop of fetch channel members
  useEffect(() => {
    const fetchChannelMembers = async (option) => {
      try {
        const response = await getChannelInfo(group.groupID, channelID);
        console.log(response);

        setMembers(response);

        setGroupReload(!groupReload);
      } catch (err) {
        console.log(err);
      }
    };
    //fetchChannelMembers(); // continuous loop...
  }, [groupReload]);

  // calculate friend options
  useEffect(() => {
    console.log("TRIGGERED");
    // get only members who are not friends
    const possibleOptions = [];
    const notPossible = [];

    console.log("friends, ", friends);

    // friends.forEach((friend) => {
    //   members.forEach((member) => {
    //     if (friend.AccountID === member.AccountID) {
    //       notPossible.push(member.AccountID);
    //     }
    //   });
    // });

    // friends.forEach((friend) => {
    //   if (!notPossible.includes(friend.AccountID)) possibleOptions.push(friend);
    // });

    setFriendOptions(possibleOptions);
    console.log("OPTIONS", friendOptions);
    console.log("MEMBERS", members);
  }, [manageChannelModalOpen, setMembers, groupReload]);

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
        <div className="manage-channels-bottom">
          <div className="manage-channels-link">
            <PeopleAltOutlinedIcon />
            <p>Add member</p>
          </div>
          {friendOptions.length > 0 ? (
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
                    icon={<Avatar src={option.Avatar} />}
                    className="friend-search-chip"
                    label={option.DisplayName}
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
              sx={{ width: "90%" }}
              id="manage-friends-searchbar"
              variant="outlined"
              placeholder="You have already added all your friends"
              inputProps={{ readOnly: true }}
            />
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
