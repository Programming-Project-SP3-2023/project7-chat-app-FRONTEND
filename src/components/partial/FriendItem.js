/**
 * Friend Label Item component
 */

import { Avatar } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Builds and renders the Friend Label Item component
 * @returns Friend Label Item component render
 */

const FriendItem = ({ friend, setSelectedChat, selectedChat }) => {
  // TODO - friend profile pic for Avatar component should come from the friend object (API call)

  const [colorID, setColorID] = useState("green");

  const navigate = useNavigate();

  // Determine icon color for online status
  useEffect(() => {
    if (friend.status === 0) setColorID("green");
    else if (friend.status === 1) setColorID("orange");
    else setColorID("red");
  }, [colorID, setColorID]);

  // handle chat select
  const handleSelect = () => {
    let userID = "";

    if (friend.RequesterID) userID = friend.RequesterID;
    if (friend.AddresseeID) userID = friend.AddresseeID;

    setSelectedChat(userID);
    navigate(`/dashboard/friends/${userID}`);
  };

  return (
    <div
      className="friend-menu-item"
      onClick={handleSelect}
      id={
        selectedChat === friend.RequesterID ||
        selectedChat === friend.AddresseeID
          ? "friend-selected"
          : null
      }
    >
      <Avatar
        className="menu-item-avatar"
        alt="Sample profile"
        src={friend.Avatar}
      />
      <div>
        <div className="friend-item-header">
          <span>{friend.DisplayName}</span>
          <span>
            <CircleIcon id={colorID} />
          </span>
        </div>
        <div className="friend-item-message">
          <p>
            {!friend.lastSent && "Me: "}
            {friend.lastMessage ? friend.lastMessage : "..."}
          </p>
        </div>
      </div>
    </div>
  );
};

//Export the Friend Label Item component
export default FriendItem;
