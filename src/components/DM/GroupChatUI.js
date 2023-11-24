/**
 * Group Chat component
 */

import {
  TextField,
  ButtonGroup,
  Box,
  Avatar,
  FormControl,
  Button,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";

// MUI components
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

// date time formatter
import dayjs from "dayjs";

// useParams can be used to get the url id
import { useParams, useOutletContext } from "react-router-dom";
import { useSocket } from "../../services/SocketContext";
import { getUserID, getUser } from "../../utils/localStorage";
import SoundFile from "../../assets/NewMsg.wav";

/**
 * Builds and renders the homepage component
 * @returns GroupChat component render
 */
const GroupChatUI = ({ socket }) => {
  //gets the friends from outlet in groups component
  const membersArray = Object.values(useOutletContext());
  const members = membersArray.flat();

  // socket.io functions
  const { loginSocket } = useSocket();
  // loading used as state to get information first before displaying chat
  const [loading, setLoading] = useState(true); // set loading to true

  // loop through sender id(by friends) and find their avatar
  const findAvatarBySenderID = (SenderID) => {
    const member = members.find((member) => member.AccountID === SenderID);

    return member ? member.avatar : null;
  };


  // through the url params of -groupID and channelID return values
  const { groupId, channelId } = useParams(); // prefered method

  const groupID = groupId;
  const channelID = parseInt(channelId);

  // messages
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [messagesAmmount, setMessagesAmmount] = useState(20);
  const [maxMessagesReached, setMaxMessagesReached] = useState(false);
  const MAX_MESSAGE_COUNT = 50;
  const messagesBetweenFetches = messagesAmmount - messages.length;

  const lastMessageRef = useRef(null); // for scrolling to latest message

  // getting local user
  const userId = getUserID();
  const username = getUser();

  const reconnect = async () => {
    await loginSocket(userId, username);
  };

  const handleReconnect = async () => {
    setLoading(true);
    await reconnect();
  };

  const handleMoreMessages = async () => {
    if (maxMessagesReached) {
    } else {
      setMessagesAmmount((prevMessageAmmount) => prevMessageAmmount + 10);
      socket.emit("moreChannelMessages", { channelID, num: messagesAmmount });
    }
    if (messagesAmmount >= MAX_MESSAGE_COUNT || messagesBetweenFetches >= 11) {
      setMaxMessagesReached(true);
    }
  };

  const [NewMsgSound] = useState(new Audio(SoundFile));

  const playSound = () => {
    NewMsgSound.play();
  };

  useEffect(() => {
    setMaxMessagesReached(false);
  }, [channelID]);

  // render on page chat
  useEffect(() => {
    setLoading(true); // loading
    const fetchData = async () => {
      try {
        // check socket user credentials are still in socket
        if (socket.accountID !== undefined && channelID !== undefined) {
          // connect to channel
          socket.emit("connectChannel", { channelID: channelID });
          socket.on("messageHistory", (messages) => {
            // set messages recieved
            setMessages(messages.flat().reverse());
            setLoading(false); //set loading as false
          });
          setMessagesAmmount(20);

          socket.emit("getChannelMessages", { channelID: channelID });
        } else {
          // attempt to reconnect socket
          handleReconnect();
        }
        // close listeners
        return () => {
          setMessages(null);
          socket.off("messageHistory");
          socket.off("channelMessageResponse");
        };
      } catch (error) {
        console.error("error getting channel info", error);
      }
    };
    fetchData();
  }, [socket, channelID]);

  useEffect(() => {
    //open listener on message response. for data
    socket.on("channelMessageResponse", (data) => {
      playSound();

      const formatMessage = {
        SenderID: data.from,
        MessageBody: data.message,
        SenderUsername: data.username.displayName,
        TimeSent: data.timestamp,
      };

      // set messages
      setMessages((messages) => [...messages, formatMessage]);
    });

    return () => {
      socket.off("channelMessageResponse");
    };
  }, [socket, messages]);

  //handle auto-scrolling to latest message
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //Message submit handling
  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const newTimestamp = new Date().getTime(); // converts to epoch time
    const messageText = messageInput.toString(); // convert user input to string

    if (messageText.trim() !== "") {
      // currently being used for local display

      const newMessage = {
        ChannelID: channelID,
        MessageBody: messageText,
        SenderID: userId,
        TimeSent: newTimestamp,
      };

      // sending > emit message of chatID and string of message
      socket.emit("sendChannelMessage", {
        channelID: channelID,
        message: messageText,
      });

      setMessages((messages) => [...messages, newMessage]); //set local messages
      setMessageInput("");
    }
  };

  // format date / time
  const formatDateTime = (timestamp) => {
    let formatTimestamp;

    // get today
    const today = dayjs();
    // return only time (if today)
    if (dayjs(timestamp).isSame(today, "day")) {
      formatTimestamp = dayjs(timestamp).format("HH:mm");
      // else return date and time
    } else {
      // format time and date
      formatTimestamp = dayjs(timestamp).format("ddd D MMM | HH:mm");
    }
    return formatTimestamp;
  };

  const formatEpochTime = (timestamp) => {
    //to set the string of date first it needs to be an integer
    //then formatted back to string....
    const date = new Date(parseInt(timestamp)).toString();

    //then formatted accordingly based on time
    const formatedDate = formatDateTime(date);

    return formatedDate;
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflow: "auto",
      }}
      id="chat-ui-container"
    >
      {loading ? (
        <div id="please-select-div">
          <p>Please select a channel...</p>
        </div>
      ) : (
        <div className="chat-messages">
          {maxMessagesReached ? (
            <p>No more messages can be loaded</p>
          ) : (
            <Button onClick={handleMoreMessages}>more messages</Button>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-content-${
                message.SenderID === userId ? "user" : "other"
              }`}
            >
              {/* SenderUsername */}
              <div>{message.SenderUsername}</div>
              {/* timestamp */}
              <div id="message-timestamp" className="message-timestamp">
                {formatEpochTime(message.TimeSent)}
              </div>
              <div className="message-content">
                {/* renders chat message */}
                {message.SenderID === userId ? (
                  <div className="message-user">
                    <div id="message">{message.MessageBody}</div>
                  </div>
                ) : (
                  // renders avatar
                  <div className="message-other">
                    <Avatar
                      alt={`User ${message.SenderID}`}
                      src={findAvatarBySenderID(message.SenderID)}
                    />
                    <div id="message">{message.MessageBody}</div>
                  </div>
                )}
                {message.MessageBody === userId && (
                  <div className="message-user">
                    <div id="message">{message.MessageBody}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={lastMessageRef} />
        </div>
      )}

      <form id="chat-input-container" onSubmit={handleMessageSubmit}>
        <FormControl fullWidth>
          <div className="chat-input">
            <TextField
              fullWidth
              id="chat-input"
              variant="outlined"
              label={"Type a Message"}
              onChange={(event) => setMessageInput(event.target.value)}
              type="text"
              placeholder="Type a Message"
              value={messageInput}
              InputProps={{
                endAdornment: (
                  <ButtonGroup>
                    <IconButton onClick={handleMessageSubmit} type="submit">
                      <SendIcon />
                    </IconButton>
                  </ButtonGroup>
                ),
              }}
            />
          </div>
        </FormControl>
      </form>
    </Box>
  );
};

//Export the homepage component
export default GroupChatUI;
