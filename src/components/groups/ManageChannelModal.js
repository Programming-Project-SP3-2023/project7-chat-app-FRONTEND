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
  const [channelOptions, setChannelOptions] = useState([]);
  const [open, setOpen] = useState(false);
  //const [friendToAdd, setFriendToAdd] = useState(null);
  const [members, setMembers] = useState([]);
  const loading = open && options.length === 0;

  // Loading function (async)
  function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  // console.log("group id...", group.groupID);
  //console.log("channel id...", channelID);
  // console.log("group info..", group);

  useEffect(() => async () => {
    if (channelID !== null && group.groupID !== null) {
      try {
        const response = await getChannelInfo(group.groupID, channelID);
        console.log(response); // seems to only return channelId, name channelType & visibility
      } catch (err) {
        console.log("error getting channel info", err);
      }
    }
  });

  // Methods
  // Handle member add
  const handleAddMember = async (option) => {
    // console.log("step 1.... adding member...");
    // console.log("group.groupid", group.groupID);
    // console.log("channelId", channelID);
    // console.log("option...", option.AccountID);

    try {
      const response = await addChannelMember(
        group.groupID,
        channelID,
        option.AccountID
      );
      console.log(response.data);
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
    console.log("attempting to update...", channelName);
    try {
      const response = await updateChannelName(
        group.groupID,
        channelID,
        channelName
      );
      console.log(response);
      setGroupReload(!groupReload);
    } catch (err) {
      console.log(err);
    }
  }

  const deleteChannelHandler = async () => {
    try {
      const response = await deleteChannel(group.groupID, channelID);
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
      // console.log("groupd id...", group.groupID);
      // console.log("channelid right?", channelID);
      if (group.groupID !== null && channelID !== null) {
        try {
          const response = await getChannelInfo(group.groupID, channelID);
          console.log("channel info response...", response);

          if (response.members) {
            setMembers(response.members);
          }

          setGroupReload(!groupReload);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchChannelMembers(); // continuous loop...
  }, []);

  // calculate friend options
  useEffect(() => {
    console.log("TRIGGERED");
    // get only members who are not friends
    const possibleOptions = [];
    const notPossible = [];

    console.log("group members....", group.GroupMembers);

    const groupMemberTemp = group.GroupMembers;
    console.log("group Member.. temp", groupMemberTemp);
    groupMemberTemp.forEach((groupMember) => {
      members.forEach((member) => {
        if (groupMember.AccountID === member.AccountID) {
          notPossible.push(member.AccountID);
        }
      });
    });

    groupMemberTemp.forEach((groupMember) => {
      if (!notPossible.includes(groupMember.AccountID))
        possibleOptions.push(groupMember);
    });

    setChannelOptions(possibleOptions);
    console.log("OPTIONS", channelOptions);
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
                    icon={<Avatar src={option.avatar} />}
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
              placeholder="All possible channel members have been added"
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