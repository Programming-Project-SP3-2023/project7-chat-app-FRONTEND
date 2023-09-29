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
import ChatUI from "../DM/ChatUI";
import AddFriendConfirmation from "../partial/AddFriendConfirmation";

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

const Friends = ({
  friends_list,
  setFriendsOpt,
  selectedFriend,
  setManageFriendsModalOpen,
}) => {
  // dummy friends objects for development.
  // the lastSent flag is denoting if the friend was the last to send a message. If true, the last chat message comes from the friend, else from the logged in user
  // the status flag is set to 0, 1 or 2. 0=offline, 1=busy, 2=online
  const friends = [
    {
      id: "001",
      name: "Jack Sparrow",
      img: "something/src.jpg",
      status: 0,
      lastSent: true,
      lastMessage: "Hey, what do you think of my new phone",
    },
    {
      id: "002",
      name: "Coco Wood",
      img: "something/src.jpg",
      status: 1,
      lastSent: false,
      lastMessage: "Kevin, meet me there when the sun goes down",
    },
    {
      id: "003",
      name: "Juliette Barton",
      img: "something/src.jpg",
      status: 2,
      lastSent: false,
      lastMessage: null,
    },
    {
      id: "004",
      name: "Mark Ruffalo",
      img: "something/src.jpg",
      status: 0,
      lastSent: true,
      lastMessage:
        "Dear Rosa, you were not originally meant to pick up groceries",
    },
  ];

  // Component state objects
  const [searchString, setSearchString] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [friendToAdd, setFriendToAdd] = useState(null);
  const [friendRequests, setFriendRequests] = useState(0);
  const loading = open && options.length === 0;
  // state handler for add friend confirmation modal
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);

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
        setOptions([...friends]);
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

  useEffect(() => {
    // TO IMPLEMENT Find out if there are many friends request there are
    const getFriendRequests = () => {
      // API call...
      // Set friend requests value (dummy)
      setFriendRequests(1);
    };

    getFriendRequests();
  }, [friendRequests, setFriendRequests]);

  return (
    <div id="friends">
      {/* Add friends confirmation modal */}
      <AddFriendConfirmation
        addFriendModalOpen={addFriendModalOpen}
        setAddFriendModalOpen={setAddFriendModalOpen}
        friendToAdd={friendToAdd}
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
                <div id="notification-flag">{friendRequests}</div>
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
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <li>
                <Chip
                  clickable
                  icon={<PersonOutlineOutlinedIcon />}
                  className="friend-search-chip"
                  label={option.name}
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
                placeholder="Search for a friend..."
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
        {selectedChat ? (
          <ChatUI selectedChat={selectedChat} />
        ) : (
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
