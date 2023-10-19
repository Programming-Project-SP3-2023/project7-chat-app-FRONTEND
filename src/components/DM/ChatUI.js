/**
 * Homepage component
 */

import {
  TextField,
  ButtonGroup,
  Box,
  // Divider,
  Avatar,
  FormControl,
  Badge,
} from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

// date time formatter
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useSocket } from "../../services/SocketContext";
import { getUserID, getUser } from "../../utils/localStorage";

/**
 * Builds and renders the homepage component
 * @returns Homepage component render
 */
const ChatUI = () => {
  const { socket } = useSocket();

  // const { id } = useParams(); // gets id from url id
  // const chatID = id;

  const chatID = 10001001;
  // Props for messages
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingStatus, setTypingStatus] = useState("");
  const [messageId, setMessageId] = useState(1);

  const userId = getUserID();
  const username = getUser();

  // // image related
  // const [selectedFile, setSelectedFile] = useState(null);
  // const hiddenFileInput = useRef(null);

  // latest ref to scroll to latest message sent
  const lastMessageRef = useRef(null);

  // render on page chat
  useEffect(() => {
    socket.emit("connectChat", chatID);

    socket.on("messageResponse", (data) => {
      console.log("recieved message response", data);
    });

    socket.on("messageHistory", (messages) => {
      setMessages(messages.flat());
      console.log("Recieved message history inside chat: ", messages);
      console.log("single message", messages[0][0]);
    });

    socket.emit("getMessages", { chatID: chatID });

    return () => {
      socket.off("messageHistory");
    };
  }, [chatID, socket]);

  // handle auto-scrolling to latest message
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // for emiting typing
  const handleTyping = useCallback(() => {
    socket.emit("typing", { username });
  }, [socket, username]);

  // for recieving typing
  useEffect(() => {
    socket.on("typing", (data) =>
      socket.broadcast.emit("typingResponse", data)
    );

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
    };
  }, [userId, handleTyping, socket]);

  //Message submit handling
  const handleMessageSubmit = (event) => {
    event.preventDefault();
    console.log("Message Handler");
    const newTimestamp = dayjs(new Date());
    const messageText = messageInput.toString();

    // console.log("userID: " + userId);
    // const TimeSent = new dayjs().format("YYYY-MM-DDTHH:mm.ssZ");

    const newMessage = {
      Message: messageId,
      ChatID: chatID,
      MessageBody: messageText,
      SenderID: userId,
      TimeSent: newTimestamp,
    };
    // console.log("new Timestamp: " + TimeSent);
    socket.emit("sendMessage", { chatID, message: messageText });

    setMessages([...messages, newMessage]);
    setMessageId(messageId + 1);
    setMessageInput("");
    setTypingStatus("");
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
      formatTimestamp = dayjs(timestamp).format("ddd D MMM | HH:mm");
    }
    return formatTimestamp;
  };

  // //image file button click
  // const handleClick = (event) => {
  //   hiddenFileInput.current.click();
  // };

  // TODO update image handling into base64

  // //Image submit handling
  // const handleFileSubmit = (event) => {
  //   event.preventDefault();

  //   const newTimestamp = dayjs(new Date());
  //   const file = event.target.files[0];

  //   if (file) {
  //     if (file.type && file.type.startsWith("image/")) {
  //       console.log("image");

  //       const newImage = {
  //         MessageID: messageId,
  //         Image: file,
  //         SenderID: userId,
  //         TimeSent: newTimestamp,
  //       };
  //       socket.emit("privateMessage", { message: newImage });
  //     } else {
  //       console.log("randomfile");

  //       const newFile = {
  //         MessageID: messageId,
  //         File: file,
  //         FileName: file.name,
  //         FileType: file.type.split("/")[1], // file type is not currently simple name
  //         FileSize: file.size, // currently passing file size in bytes
  //         SenderID: userId,
  //         TimeSent: newTimestamp,
  //       };
  //       socket.emit("privateMessage", { message: newFile });
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
      {/* USER */}
      <div className="chat-messages">
        {messages.map((message, index) =>
          message.SenderID === userId ? ( //currently gets local stored user
            <div
              ref={lastMessageRef}
              className="message-content"
              key={`user-message-${index}`}
            >
              <div className="message-timestamp">
                {formatDateTime(message.TimeSent)}
              </div>
              {/* message only rendering */}
              {message.MessageBody && (
                <div className="message-user">
                  <div id="message">{message.MessageBody}</div>
                </div>
              )}

              {/* renders image if available */}
              {message.Image && (
                <div className="message-user">
                  <div
                    id="message-image-container"
                    className={`message-image-container`}
                  >
                    <img
                      id="message-image"
                      className={`message-image other`}
                      src={message.Image}
                      alt={message.Image}
                    />
                  </div>
                </div>
              )}

              {message.File && (
                <div id="message-file">
                  <div>
                    <Badge
                      id="message-file-mui"
                      fontsize="large"
                      anchorOrigin={{
                        vertical: "center",
                        horizontal: "center",
                      }}
                      badgeContent={message.FileType}
                    >
                      <InsertDriveFileOutlinedIcon fontSize="large" />
                    </Badge>
                  </div>
                  <div className="file-name">{message.FileName}</div>
                  <div className="file-size">{message.FileSize}</div>
                </div>
              )}
            </div>
          ) : (
            // OTHER
            <div
              ref={lastMessageRef}
              className="message-content"
              key={`user-message-${index}`}
            >
              <div className="message-timestamp">
                {formatDateTime(message.TimeSent)}
              </div>
              {/* renders text if available */}
              {message.MessageBody && (
                <div className="message-other">
                  <Avatar
                    alt={`User ${message.SenderID}`}
                    src={message.SenderID.Avatar}
                  />
                  <div id="message">{message.MessageBody}</div>
                </div>
              )}

              {/* renders image if available */}
              {message.Image && (
                <div className="message-other">
                  <div id="message-image-container" className={`message-other`}>
                    <img
                      id="message-image"
                      className={`message-other`}
                      src={message.Image}
                      alt={message.Image}
                    />
                  </div>
                </div>
              )}

              {message.File && (
                <div id="message-file">
                  <div>
                    <Badge
                      id="message-file-mui"
                      fontsize="large"
                      anchorOrigin={{
                        vertical: "center",
                        horizontal: "center",
                      }}
                      badgeContent={message.FileType}
                    >
                      <InsertDriveFileOutlinedIcon fontSize="large" />
                    </Badge>
                  </div>
                  <div className="file-name">{message.FileName}</div>
                  <div className="file-size">{message.FileSize}</div>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* typing status */}
      <div className="message-status">
        <p>{typingStatus}</p>
      </div>
      <form id="chat-input-container" onSubmit={handleMessageSubmit}>
        <FormControl fullWidth>
          <div className="chat-input">
            <TextField
              fullWidth
              id="chat-input"
              variant="outlined"
              label={typingStatus || "Type a Message"}
              onChange={(event) => setMessageInput(event.target.value)}
              type="text"
              placeholder="Type a Message"
              value={messageInput}
              onKeyDown={handleTyping}
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
    </Box>
  );
};

//Export the homepage component
export default ChatUI;
