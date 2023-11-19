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
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

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

  // for image handling
  // const [selectedFile, setSelectedFile] = useState(null);
  // const hiddenFileInput = useRef(null);

  const lastMessageRef = useRef(null); // for scrolling to latest message // currently broken

  // getting local user
  const userId = getUserID();
  const username = getUser();

  const [NewMsgSound] = useState(new Audio('/NewMsg.wav'));

  const playSound = () =>{
    NewMsgSound.play();
  };


  // loop through SenderID to find friends avatar in friends list
  const findAvatarBySenderID = (SenderID) => {
    const friend = friends.find((friend) => friend.AccountID === SenderID);
    return friend ? friend.Avatar : null;
  };

  const reconnect = async () => {
    await loginSocket(userId, username);
  };

  const handleReconnect = async () => {
    setLoading(true);
    await reconnect();
  };

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

      // ask for messages
      socket.emit("getMessages", { chatID: chatID });
    } else {
      // attempt to reconnect socket
      handleReconnect();
    }
    // close listeners
    return () => {
      socket.off("messageHistory");
      socket.off("messageResponse");
    };
  }, [chatID, socket]);

  useEffect(() => {
    //open listener on message response. for data
    socket.on("messageResponse", (data) => {
      playSound();
      console.log("recieved message response", data);

      // const messageRecieved = dayjs(new Date());
      const formatMessage = {
        SenderID: data.from,
        MessageBody: data.message,
        TimeSent: formatDateTime(data.timestamp),
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

    console.log("message submit timestamp: ", newTimestamp);
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

  //image file button click
  // const handleClick = (event) => {
  //   hiddenFileInput.current.click();
  // };

  // TODO update image handling into base64

  // Image submit handling
  // const handleFileSubmit = (event) => {
  //   event.preventDefault();

  //   const newTimestamp = dayjs(new Date());
  //   const file = event.target.files[0];

  //   if (file) {
  //     if (file.type && file.type.startsWith("image/")) {
  //       console.log("image");

  //       const newImage = {
  //         ChatID: chatID,
  //         Image: file,
  //         SenderID: userId,
  //         TimeSent: newTimestamp,
  //       };
  //       socket.emit("privateMessage", { chatID, message: newImage });
  //       } else {
  //         console.log("randomfile");

  //         const newFile = {
  //           MessageID: messageId,
  //           File: file,
  //           FileName: file.name,
  //           FileType: file.type.split("/")[1], // file type is not currently simple name
  //           FileSize: file.size, // currently passing file size in bytes
  //           SenderID: userId,
  //           TimeSent: newTimestamp,
  //         };
  //         socket.emit("privateMessage", { message: newFile });
  //     }
  //   }

  //   setSelectedFile(null);
  // };

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
                {/* renders chat message */}
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
                {message.MessageBody === userId && (
                  <div className="message-user">
                    <div id="message">{message.MessageBody}</div>
                  </div>
                )}
              </div>
              {/* renders image if available */}
              {message.Image && (
                <div
                  id="message-image-container"
                  className={`message-image-container ${
                    message.sender === userId ? "user" : "other"
                  }`}
                >
                  <img
                    id="message-image"
                    className={`message-image ${
                      message.sender === userId ? "user" : "other"
                    }`}
                    src={message.Image}
                    alt={message.Image}
                  />
                </div>
              )}
              {/* renders file if available */}
              {message.file_name && (
                <div id="message-file">
                  <div>
                    <Badge
                      id="message-file-mui"
                      fontsize="large"
                      anchorOrigin={{
                        vertical: "center",
                        horizontal: "center",
                      }}
                      badgeContent={message.file_type}
                    >
                      <InsertDriveFileOutlinedIcon fontSize="large" />
                    </Badge>
                  </div>
                  <div>{message.file_name}</div>
                  <div>{message.file_size}</div>
                </div>
              )}
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
                    <IconButton
                      className="image-select-button"
                      // onClick={handleClick}
                    >
                      <input
                        hidden
                        // types of files that are accepted
                        // add to include .pdf, .doc, .txt
                        // value={selectedFile}
                        accept="image/*"
                        id="file-input"
                        type="file"
                        // ref={hiddenFileInput}
                        style={{ display: "none" }}
                        // onChange={handleFileSubmit}
                      />
                      <AttachFileIcon />
                    </IconButton>
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
