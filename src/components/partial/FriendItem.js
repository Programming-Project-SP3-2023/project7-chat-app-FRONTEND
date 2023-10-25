/**
 * Friend Label Item component
 */

import { Avatar } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSocket } from "../../services/SocketContext";

/**
 * Builds and renders the Friend Label Item component
 * @returns Friend Label Item component render
 */

const FriendItem = ({ friend, setSelectedChat, selectedChat }) => {
  // TODO - friend profile pic for Avatar component should come from the friend object (API call)
  const { socket } = useSocket();
  const [colorID, setColorID] = useState("green");

  const navigate = useNavigate();
  // const chatID = 10001001; // temp room
  // Determine icon color for online status

  useEffect(() => {
    if (friend.status === 0) setColorID("green");
    else if (friend.status === 1) setColorID("orange");
    else setColorID("red");
  }, [colorID, setColorID]);

  // handle chat select

  const handleSelect = async () => {
    let userID = "";
    // let chatID = "";
    if (friend.RequesterID) userID = friend.RequesterID;
    if (friend.AddresseeID) userID = friend.AddresseeID;
    console.log("friendshipID: ", friend.FriendshipID);
    let chatID = friend.FriendshipID;
    setSelectedChat(userID);

    //const chatID = 10101013; // temp room

    socket.emit("connectChat", { chatID });
    setTimeout(() => {
      navigate(`/dashboard/friends/${chatID}`);
    }, 1000);

    const joinChatPromise = new Promise((resolve, reject) => {
      socket.emit("connectChat", { chatID });

      socket.on("connectChatResponse", () => {
        resolve();
      });

      socket.on("error", (error) => {
        reject(error);
      });

      setTimeout(() => {
        reject("Socket didn't join the chat in time.");
      }, 5000);
    });

    try {
      await joinChatPromise;
      navigate(`/dashboard/friends/${userID}`);
    } catch (error) {
      console.error(error);
    }
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
