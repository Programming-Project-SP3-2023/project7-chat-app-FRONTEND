/**
 * Homepage component
 */

// react related
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useSocket } from "../../services/SocketContext";

// material UI related
import {
  TextField,
  ButtonGroup,
  Box,
  // Divider,
  Avatar,
  FormControl,
  Badge,
  Button,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import SoundFile from "../../assets/NewMsg.wav";

// date time formatter
import dayjs from "dayjs";

// get local user info
import { getUserID, getUser } from "../../utils/localStorage";

/**
 * Builds and renders the homepage component
 * @returns Homepage component render
 */
const ChatUI = () => {
  // gets friends list from friends outlet socket
  const friendsArray = Object.values(useOutletContext());
  const friends = friendsArray.flat();

  //socket related
  const { loginSocket, socket } = useSocket();

  // select id located in url
  const { id } = useParams();
  const chatID = id;

  // for message loading/rendering
  const [loading, setLoading] = useState(true); // set loading to true

  // for messages handling
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [messagesAmmount, setMessagesAmmount] = useState(20);
  const [maxMessagesReached, setMaxMessagesReached] = useState(false);
  const MAX_MESSAGE_COUNT = 50; // set message fetch limit

  const messagesBetweenFetches = messagesAmmount - messages.length;

  const lastMessageRef = useRef(null); // for scrolling to latest message // currently broken

  // getting local user
  const userId = getUserID();
  const username = getUser();

  const [NewMsgSound] = useState(new Audio(SoundFile));

  const playSound = () => {
    NewMsgSound.play();
  };

  // loop through SenderID to find friends avatar in friends list
  const findAvatarBySenderID = (SenderID) => {
    const friend = friends.find((friend) => friend.AccountID === SenderID);
    return friend ? friend.Avatar : null;
  };

  // handle socket reconnect method
  const reconnect = async () => {
    await loginSocket(userId, username);
  };
  const handleReconnect = async () => {
    setLoading(true);
    await reconnect();
  };

  // handle fetch more message method
  const handleMoreMessages = async () => {
    //max messages is determined by either the maximum limit or
    // there is no longer any more messages to fetch
    if (maxMessagesReached) {
      console.log("maximum ammount of messages reached");
    } else {
      // set the next ammount of messages to fetch
      setMessagesAmmount((prevMessageAmmount) => prevMessageAmmount + 10);
      // ask for more messages
      socket.emit("moreMessages", { chatID, num: messagesAmmount });
    }
    // if there isn't enough messages to fetch the message ammount has been reached
    if (messagesAmmount >= MAX_MESSAGE_COUNT || messagesBetweenFetches >= 11) {
      setMaxMessagesReached(true);
    }
  };

  // effects
  useEffect(() => {
    setMaxMessagesReached(false);
  }, [chatID]);

  // render on page chat
  useEffect(() => {
    setLoading(true); // loading

    // check socket user credentials are still in socket
    if (socket.accountID !== undefined && chatID !== null) {
      // connect chat id
      socket.emit("connectChat", { chatID });

      // open listener of messageHistory for messages
      socket.on("messageHistory", (messages) => {
        // set messages recieved
        setMessages(messages.flat().reverse());
        setLoading(false); //set loading as false
      });
      // reset message ammount based on page render
      setMessagesAmmount(20);
      // ask for messages
      socket.emit("getMessages", { chatID: chatID });
    } else {
      // attempt to reconnect socket
      handleReconnect();
    }
    // close listeners
    return () => {
      socket.off("messageHistory");
    };
  }, [chatID, socket]);

  useEffect(() => {
    //open listener on message response. for data
    socket.on("messageResponse", (data) => {
      playSound();
      console.log("recieved message response", data);

      const formatMessage = {
        SenderID: data.from,
        MessageBody: data.message,
        TimeSent: data.timestamp,
      };
      // set messages
      setMessages((messages) => [...messages, formatMessage]);
    });

    return () => {
      socket.off("messageResponse");
    };
  }, [socket, messages]);

  //handle auto-scrolling to latest message
  useLayoutEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //Message submit handling
  const handleMessageSubmit = (event) => {
    event.preventDefault();
    console.log("Message Handler");
    const newTimestamp = new Date().getTime(); // converts to epoch time
    const messageText = messageInput.toString(); // convert user input to string

    // check if message is empty
    if (messageText.trim() !== "") {
      // currently being used for local display
      const newMessage = {
        ChatID: chatID,
        MessageBody: messageText,
        SenderID: userId,
        TimeSent: newTimestamp,
      };
      // sending > emit message of chatID and string of message
      socket.emit("sendMessage", { chatID, message: messageText });

      //as the messages are broadcasted to other members the user won't
      //see his own messages unless set here
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
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        <div className="chat-messages">
          {maxMessagesReached ? (
            <p>No more messages can be fetched</p>
          ) : (
            <Button onClick={handleMoreMessages}>more messages</Button>
          )}
          {/* dynamically display users / other messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-content-${
                message.SenderID === userId ? "user" : "other"
              }`}
            >
              {/* timestamp */}
              <div id="message-timestamp" className="message-timestamp">
                {formatEpochTime(message.TimeSent)}
              </div>
              <div className="message-content">
                {/* renders avatar message */}
                {message.SenderID === userId ? (
                  <div className="message-user">
                    <div id="message">{message.MessageBody}</div>
                  </div>
                ) : (
                  <div className="message-other">
                    <Avatar
                      alt={`User ${message.SenderID}`}
                      src={findAvatarBySenderID(message.SenderID)}
                    />
                    <div id="message">{message.MessageBody}</div>
                  </div>
                )}
                {/* messages body */}
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
      <audio hidden></audio>
    </Box>
  );
};

//Export the homepage component
export default ChatUI;
