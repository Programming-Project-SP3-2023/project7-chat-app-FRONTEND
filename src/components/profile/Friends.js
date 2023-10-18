/**
 * Friends Chats component
 */

import FriendItem from "../partial/FriendItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import {
  InputAdornment,
  Link,
  Autocomplete,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import AddFriendConfirmation from "../partial/AddFriendConfirmation";
import ManageFriendsModal from "../partial/ManageFriendsModal";
import { Outlet } from "react-router-dom";
import {
  getFriends,
  getUsers,
  getFriendRequests,
} from "../../services/friendsAPI";
import { getUserID } from "../../utils/localStorage";

/**
 * Builds and renders the friends chats component
 * @returns Friends chats component render
 */

// Loading function (async)
function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const Friends = ({ friends_list, setFriendsOpt, selectedFriend }) => {
  // dummy friends objects for development.
  // the lastSent flag is denoting if the friend was the last to send a message. If true, the last chat message comes from the friend, else from the logged in user
  // the status flag is set to 0, 1 or 2. 0=offline, 1=busy, 2=online

  // Component state objects
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState(null);
  const [searchString, setSearchString] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [friendToAdd, setFriendToAdd] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [requestNo, setRequestNo] = useState(0);
  const loading = open && options.length === 0;
  // state handler for add friend confirmation modal
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
  // state handler for manage friends modal
  const [manageFriendsModalOpen, setManageFriendsModalOpen] = useState(false);

  const [fetching, setFetching] = useState(false);

  // Methods
  // Handle friend add
  const handleAddFriend = (option) => {
    setFriendToAdd(option);
    setAddFriendModalOpen(true);
  };

  // Effects
  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...users]);
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

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      const response = await getUsers("");
      console.log(response[0]);
      setUsers(response[0]);
    }

    fetchUsers();
  }, [loading]);

  // Fetch friends
  useEffect(() => {
    async function fetchFriends() {
      const response = await getFriends();
      const temp = [];
      if (users) {
        users.forEach((user) => {
          for (let i = 0; i < response.length; i++) {
            if (
              (user.AccountID === response[i].AddresseeID &&
                response[i].AddresseeID !== getUserID()) ||
              (user.AccountID === response[i].RequesterID &&
                response[i].RequesterID !== getUserID())
            ) {
              temp.push(user);
            }
          }
        });
      }
      setFriends(temp);
    }

    fetchFriends();
  }, [fetching]);

  useEffect(() => {
    async function fetchFriendRequests() {
      setFetching(true);
      const response = await getFriendRequests();
      console.log(response);

      const temp = [];
      if (users) {
        users.forEach((user) => {
          for (let i = 0; i < response.length; i++) {
            if (user.AccountID === response[i].AddresseeID) {
              temp.push(user);
            }
          }
        });
      }
      setFriendRequests(temp);
      setRequestNo(temp.length);
    }

    fetchFriendRequests();
    setFetching(false);
  }, [fetching]);


  return (
    <div id="friends">
      {/* Add friends confirmation modal */}
      <AddFriendConfirmation
        addFriendModalOpen={addFriendModalOpen}
        setAddFriendModalOpen={setAddFriendModalOpen}
        friendToAdd={friendToAdd}
      />
      {/* Manage Friends Modal */}
      <ManageFriendsModal
        manageFriendsModalOpen={manageFriendsModalOpen}
        setManageFriendsModalOpen={setManageFriendsModalOpen}
        users={users}
        friends={friends}
      />
      <div className="friends-menu">
        <div className="friends-display">
          {friends.map((friend, i) => {
            return (
              <FriendItem
                key={i}
                friend={friend}
                setSelectedChat={setSelectedChat}
                selectedChat={selectedChat}
              />
            );
          })}
        </div>
        <div className="friends-bottombar">
          <div className="add-friends-link">
            <Link onClick={() => setManageFriendsModalOpen(true)}>
              <PeopleAltOutlinedIcon />
              <p>Manage friends</p>
              {friendRequests > 0 && (
                <div id="notification-flag">{requestNo}</div>
              )}
            </Link>
          </div>
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
                  icon={<PersonOutlineOutlinedIcon />}
                  className="friend-search-chip"
                  label={option.DisplayName}
                  sx={{ width: "100%" }}
                  deleteIcon={
                    <PersonAddOutlinedIcon className="add-friend-icon" />
                  }
                  onDelete={() => handleAddFriend(option)}
                />
              </li>
            )}
            options={options}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                id="friends-searchbar"
                variant="outlined"
                placeholder="Add a new friend..."
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
        </div>
      </div>
      <div className="friends-chat-area">
        <Outlet />
        {!selectedChat && (
          <>
            <h2>No chat selected.</h2>
            <h2>Open a conversation and start typing!</h2>
          </>
        )}
      </div>
    </div>
  );
};

//Export the Friends component
export default Friends;
