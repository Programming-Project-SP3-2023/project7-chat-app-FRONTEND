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
  Avatar,
} from "@mui/material";
import { useState, useEffect } from "react";
import AddFriendConfirmation from "./AddFriendConfirmation";
import ManageFriendsModal from "./ManageFriendsModal";
import { Outlet } from "react-router-dom";
import {
  getFriends,
  getUsers,
  getFriendRequests,
} from "../../services/friendsAPI";

import { useSocket } from "../../services/SocketContext";
import { getNonfriends } from "../../utils/utils";
import { getUser, getUserID } from "../../utils/localStorage";

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
  //const socket = useSocket();

  // dummy friends objects for development.
  // the lastSent flag is denoting if the friend was the last to send a message. If true, the last chat message comes from the friend, else from the logged in user
  // the status flag is set to 0, 1 or 2. 0=offline, 1=busy, 2=online

  // Component state objects
  const [friends, setFriends] = useState([]);
  const [messageHistories, setMessageHistories] = useState({});
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
  const { socket, loginSocket } = useSocket();

  // trigger refresh flag
  const [refresh, setRefresh] = useState(false);
  const user = getUser();
  const accountID = getUserID();

  // Methods
  // Handle friend add
  const handleAddFriend = (option) => {
    setFriendToAdd(option);
    setAddFriendModalOpen(true);
  };

  // for handling get last message
  useEffect(() => {
    //on friendship id / chatID fetch messages
    const fetchMessageHistoryForFriend = (friendshipID) => {
      return new Promise((resolve, reject) => {
        // console.log("accountID.... here?", socket.AccountID);
        if (socket.accountID !== undefined) {
          // connect to chat
          socket.emit("connectChat", { chatID: friendshipID });
          // listen for chat messages
          socket.on("messageHistory", (messages) => {
            resolve(messages);
          });
          // ask for single message from chatID
          socket.emit("moreMessages", { chatID: friendshipID, num: 1 });
        } else {
          loginSocket(accountID, user.username);
        }
      });
    };

    const fetchMessageHistories = async () => {
      // Object to store message history for each friend
      const messageHistories = {};

      for (const friend of friends) {
        // call specific friend message
        const messageHistory = await fetchMessageHistoryForFriend(
          friend.FriendshipID
        );

        // Store the message history for specific friend
        messageHistories[friend.AccountID] = messageHistory;
      }
      // set message histories to pass to friend Item
      setMessageHistories(messageHistories);
    };
    //call the method
    fetchMessageHistories();
  }, [friends, socket, accountID, user.username, setMessageHistories]);

  // Effects
  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        const notFriends = getNonfriends(users, friends);
        setOptions([...notFriends]);
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

  // Fetch all users, friends and friend requests
  useEffect(() => {
    // 1. set fetching state to true for page to be on hold (loading)
    setFetching(true);

    // 2. define fetch users function
    async function fetchUsers() {
      const response = await getUsers("");
      console.log("USERS: ", response[0]);
      setUsers(response[0]);
    }

    // 3. define fetch friends function
    async function fetchFriends() {
      const response = await getFriends();
      console.log("FRIENDS: ", response);
      setFriends(response);
    }

    // 4. define fetch friends requests function
    async function fetchFriendRequests() {
      setFetching(true);
      const response = await getFriendRequests();
      console.log("REQUESTS: ", response);

      setFriendRequests(response);
      setRequestNo(response.length);
    }

    // 5. Call functions
    async function runFetch() {
      await fetchUsers();
      await fetchFriends();
      await fetchFriendRequests();
      // once fetched, set fetching state to false
      setFetching(false);
      setRefresh(false);
    }

    runFetch();
  }, [refresh]);

  return (
    <>
      {fetching && (
        <div id="loading-screen">
          <CircularProgress size={100} />
        </div>
      )}
      {!fetching && (
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
            friendRequests={friendRequests}
            setRefresh={setRefresh}
            setFriendToAdd={setFriendToAdd}
            setAddFriendModalOpen={setAddFriendModalOpen}
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
                    messageHistory={messageHistories[friend.AccountID]}
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
      )}
    </>
  );
};

//Export the Friends component
export default Friends;
