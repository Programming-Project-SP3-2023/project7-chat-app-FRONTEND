/**
 * Friend Label Item component
 */

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

const FriendItem = ({ friend, setSelectedChat, selectedChat }) => {
  // TODO - friend profile pic for Avatar component should come from the friend object (API call)
  const { socket } = useSocket();
  const [colorID, setColorID] = useState("green");
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [lastMessage, setLastMessage] = useState([]);
  const userId = getUserID();

  const navigate = useNavigate();
  // const chatID = 10001001; // temp room

  const getLastMessage = async () => {
    try {
      const messageHistory = await new Promise((resolve, reject) => {
        socket.on("messageHistory", (messageHistory) => {
          resolve(messageHistory);
        });

        socket.emit("connectChat", { chatID: friend.FriendshipID });
        socket.emit("moreMessages", { chatID: friend.FriendshipID, num: 1 }); // return a single message

        setTimeout(() => {
          reject("getting single message timed out.");
        }, 5000);
      });

      const message = messageHistory.find(
        (chat) => chat[0].chatID === friend.Friend
      );

      if (message) {
        setLastMessage(message);
      } else {
        setLastMessage("start chatting");
      }
      console.log("message: ", message);
      setLastMessage(message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLastMessage();
  }, []);

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
      setColorID("red");
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
          {lastMessage.map((message, index) => (
            <div
              key={index}
              className={`message-content-${
                message.SenderID === userId ? "user" : "other"
              }`}
            >
              {message.SenderID === userId ? (
                <p>Me: {message.MessageBody}</p>
              ) : (
                <p>{message.MessageBody}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

//Export the Friend Label Item component
export default FriendItem;
