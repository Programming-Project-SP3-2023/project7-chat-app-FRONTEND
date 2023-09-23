/**
 * Friends Chats component
 */

import { Box } from "@mui/material";

/**
 * Builds and renders the friends chats component
 * @returns Friends chats component render
 */

const Friends = ({ friends_list, setFriendsOpt, selectedFriend }) => {
  return (
    <div id="friends">
      <div className="friends-display"></div>
      <div className="friends-chat-area"></div>
    </div>
  );
};

//Export the Friends component
export default Friends;
