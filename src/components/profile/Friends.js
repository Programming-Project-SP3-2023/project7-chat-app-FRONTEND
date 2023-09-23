/**
 * Friends Chats component
 */

import FriendItem from "../partial/FriendItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { InputAdornment, Link } from "@mui/material";
import { useState } from "react";
import ChatUI from "../DM/ChatUI";

/**
 * Builds and renders the friends chats component
 * @returns Friends chats component render
 */

const Friends = ({ friends_list, setFriendsOpt, selectedFriend }) => {
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

  return (
    <div id="friends">
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
            <Link>
              <PersonAddOutlinedIcon />
              <p>Add friends</p>
            </Link>
          </div>
          <TextField
            sx={{ width: "90%" }}
            id="friends-searchbar"
            variant="outlined"
            placeholder="Search for a friend..."
            value={searchString}
            onChange={(event) => setSearchString(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
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
