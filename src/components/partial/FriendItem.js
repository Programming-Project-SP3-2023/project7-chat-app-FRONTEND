/**
 * Friend Label Item component
 */
import { Outlet } from "react-router-dom";

import { Avatar } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSocket } from "../../services/SocketContext";
import { getUserID } from "../../utils/localStorage";

/**
 * Builds and renders the Friend Label Item component
 * @returns Friend Label Item component render
 */

const FriendItem = ({
  friend,
  setSelectedChat,
  selectedChat,
  messageHistory,
}) => {
  const userID = getUserID();
  // TODO - friend profile pic for Avatar component should come from the friend object (API call)
  const { socket } = useSocket();
  const [colorID, setColorID] = useState("green");
  const [onlineFriends, setOnlineFriends] = useState([]);
  const navigate = useNavigate();
  // const chatID = 10001001; // temp room

  //listener for online friends
  useEffect(() => {
    // get list of online friends
    socket.on("onlineFriends", (data) => {
      //set list of online friends
      setOnlineFriends(data);
    });
    // ask for data
    socket.emit("getOnlineFriends");

    return () => {
      // close socket listner afterwards
      socket.off("getOnlineFriends");
    };
  }, [socket]);

  // Determine icon color for online status
  useEffect(() => {
    //looks for online friend based on account id
    if (onlineFriends.includes(friend.AccountID)) {
      setColorID("green");
    } else {
      setColorID("grey");
    }
  }, [colorID, setColorID, onlineFriends, friend.AccountID]);

  // handle chat select
  const handleSelect = async () => {
    let userID = "";
    // let chatID = "";
    if (friend.RequesterID) userID = friend.RequesterID;
    if (friend.AddresseeID) userID = friend.AddresseeID;
    console.log("friendshipID: ", friend.FriendshipID);
    let chatID = friend.FriendshipID;
    setSelectedChat(userID);

    // // const chatID = 10101013; // temp room

    const joinChatPromise = new Promise((resolve, reject) => {
      // attempt to join chat room
      socket.emit("connectChat", { chatID });
      // waits for join response
      socket.on("connectChatResponse", () => {
        resolve();
      });

      socket.on("error", (error) => {
        reject(error);
      });
      // timeout response
      setTimeout(() => {
        reject("Socket didn't join the chat in time.");
      }, 5000);
    });

    // attempts to navigate to chatroom id
    try {
      await joinChatPromise;
      navigate(`/dashboard/friends/${chatID}`); // required to be chatID
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
          {messageHistory && messageHistory.length > 0 ? (
            messageHistory.map((message, index) => (
              <div
                key={index}
                className={`message-content-${
                  message.SenderID === userID ? "user" : "other"
                }`}
              >
                {message.SenderID === userID ? (
                  <p>Me: {message[0]?.MessageBody || " "}</p>
                ) : (
                  <p>{message[0]?.MessageBody || " "}</p>
                )}
              </div>
            ))
          ) : (
            <p>No Message Available</p>
          )}
        </div>
      </div>
    </div>
  );
};
<Outlet />;
//Export the Friend Label Item component
export default FriendItem;
