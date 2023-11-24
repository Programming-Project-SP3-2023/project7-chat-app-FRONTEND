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
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import MemberChip from "../partial/MemberChip";
import { addGroupMember, removeGroupMember } from "../../services/groupsAPI";

/**
 * Builds and renders the Manage Group Members Modal component
 * @returns Manage Members Modal component render
 */

const ManageMembersModal = ({
  manageMembersModalOpen,
  setManageMembersModalOpen,
  members,
  setMembers,
  friends,
  setRefresh,
  groupID,
  groupReload,
  setGroupReload,
}) => {
  // Component state objects
  const [searchString, setSearchString] = useState("");
  const [options, setOptions] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const [open, setOpen] = useState(false);

  const loading = open && options.length === 0;

  // Loading function (async)
  function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  // Methods
  // Handle member add
  const handleAddMember = async (option) => {
    try {
      const response = await addGroupMember(groupID, option.Email);
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
      setOpen(false);
    } catch (err) {
    }
  };

  // Handle member remove
  const handleRemoveMember = async (member, i) => {
    try {
      const response = await removeGroupMember(groupID, member.AccountID);
      setGroupReload(!groupReload);
      // Manually remove member for frontend view/func only.
      // Next time the modal is open it will have the exact elements pulled from backend
      const tempMembers = members;
      tempMembers.splice(i, 1);
      setMembers(tempMembers);
    } catch (err) {
    }
  };

  // handle modal closing
  const handleClose = () => setManageMembersModalOpen(false);

  // Effects

  // calculate friend options
  useEffect(() => {
    // get only members who are not friends
    const possibleOptions = [];
    const notPossible = [];
    friends.forEach((friend) => {
      members.forEach((member) => {
        if (friend.AccountID === member.AccountID) {
          notPossible.push(member.AccountID);
        }
      });
    });

    friends.forEach((friend) => {
      if (!notPossible.includes(friend.AccountID)) possibleOptions.push(friend);
    });

    setMemberOptions(possibleOptions);

  }, [manageMembersModalOpen, setMembers, groupReload]);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...memberOptions]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, memberOptions]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open, memberOptions]);

  return (
    <Modal
      id="manage-friends-modal-background"
      open={manageMembersModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box id="manage-members-modal">
        <div id="manage-members-modal-header">
          <h2>Manage Members</h2>
        </div>
        <div id="manage-friends-modal-whitebox">
          {members &&
            members.map((member, i) => {
              return (
                <MemberChip
                  key={i}
                  member={member}
                  request={false}
                  setRefresh={setRefresh}
                  setManageFriendsModalOpen={setManageMembersModalOpen}
                  handleRemoveMember={() => handleRemoveMember(member, i)}
                />
              );
            })}
        </div>
        <div className="manage-friends-bottom">
          <div className="manage-friends-link">
            <PeopleAltOutlinedIcon />
            <p>Add member</p>
          </div>
          {memberOptions.length > 0 ? (
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
        </div>
      </Box>
    </Modal>
  );
};

//Export the Manage Members Modal component
export default ManageMembersModal;
