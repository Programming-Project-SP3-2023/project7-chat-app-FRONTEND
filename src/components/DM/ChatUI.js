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
import { useState, useEffect, useRef } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

// date time formatter
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { getUserID } from "../../utils/localStorage";

/**
 * Builds and renders the homepage component
 * @returns Homepage component render
 */
const ChatUI = ({ socket }) => {
  const userId = getUserID();
  //const chatId = 10001001;
  const { chatId } = useParams();
  console.log("Chat ID: " + chatId);
  console.log("UserID: " + userId);
  // socket.emit("connection", socket);
  // socket.emit("connectChat", ({ chatId }) => {});

  // Props for messages
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingStatus, setTypingStatus] = useState("");
  const [messageId, setMessageId] = useState(1);

  // latest ref to scroll to latest message sent
  const lastMessageRef = useRef(null);

  //Message submit handling
  const handleMessageSubmit = (event) => {
    event.preventDefault();
    console.log("Message Handler");
    const newTimestamp = dayjs(new Date());

    const newMessage = {
      messageID: messageId,
      chatID: chatId,
      messageBody: messageInput,
      senderID: userId,
      timeSent: newTimestamp,
    };

    socket.emit("privateMessage", { message: newMessage });

    setMessages([...messages, newMessage]);
    setMessageId(messageId + 1);
    setMessageInput("");
  };

  // for handling message display from server
  useEffect(() => {
    socket.on("privateMessage", ([message, timestamp]) => {
      setMessages([...messages, { ...message, timestamp }]);
    });
  }, [socket, messages]);

  // handle auto-scrolling to latest message
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = () => {
    socket.emit("typing", { userId });
  };

  // for handling user typing
  useEffect(() => {
    socket.on("typingResponse", (data) => setTypingStatus(data));
  }, [socket]);

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

  // image related
  const [selectedFile, setSelectedFile] = useState(null);
  const hiddenFileInput = useRef(null);

  //image file button click
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  // TODO update image handling into base64

  //Image submit handling
  const handleFileSubmit = (event) => {
    event.preventDefault();

    const newTimestamp = dayjs(new Date());
    const file = event.target.files[0];

    if (file) {
      if (file.type && file.type.startsWith("image/")) {
        console.log("image");

        const newImage = {
          messageID: messageId,
          image: file,
          senderID: userId,
          timesent: newTimestamp,
        };
        socket.emit("privateMessage", { message: newImage });
      } else {
        console.log("randomfile");

        const newFile = {
          messageID: messageId,
          file: file,
          fileName: file.name,
          fileType: file.type.split("/")[1], // file type is not currently simple name
          fileSize: file.size, // currently passing file size in bytes
          senderID: userId,
          timeSent: newTimestamp,
        };
        socket.emit("privateMessage", { message: newFile });
      }
    }

    setSelectedFile(null);
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
      {/* USER */}
      <div className="chat-messages">
        {messages.map((message, index) =>
          message.senderID === userId ? ( //currently gets local stored user
            <div
              ref={lastMessageRef}
              className="message-content"
              key={`user-message-${index}`}
            >
              <div className="message-timestamp">
                {formatDateTime(message.timestamp)}
              </div>
              {/* message only rendering */}
              {message.messageBody && (
                <div className="message-user">
                  <div id="message">{message.messageBody}</div>
                </div>
              )}

              {/* renders image if available */}
              {message.image && (
                <div className="message-user">
                  <div
                    id="message-image-container"
                    className={`message-image-container`}
                  >
                    <img
                      id="message-image"
                      className={`message-image other`}
                      src={message.image}
                      alt={message.image}
                    />
                  </div>
                </div>
              )}

              {message.file && (
                <div id="message-file">
                  <div>
                    <Badge
                      id="message-file-mui"
                      fontsize="large"
                      anchorOrigin={{
                        vertical: "center",
                        horizontal: "center",
                      }}
                      badgeContent={message.fileType}
                    >
                      <InsertDriveFileOutlinedIcon fontSize="large" />
                    </Badge>
                  </div>
                  <div className="file-name">{message.fileName}</div>
                  <div className="file-size">{message.fileSize}</div>
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
                {formatDateTime(message.timestamp)}
              </div>
              {/* renders text if available */}
              {message.messageBody && (
                <div className="message-other">
                  <Avatar
                    alt={`User ${message.user}`}
                    src={message.userAvatar}
                  />
                  <div id="message">{message.messageBody}</div>
                </div>
              )}

              {/* renders image if available */}
              {message.image && (
                <div className="message-other">
                  <div id="message-image-container" className={`message-other`}>
                    <img
                      id="message-image"
                      className={`message-other`}
                      src={message.image}
                      alt={message.image}
                    />
                  </div>
                </div>
              )}

              {message.file && (
                <div id="message-file">
                  <div>
                    <Badge
                      id="message-file-mui"
                      fontsize="large"
                      anchorOrigin={{
                        vertical: "center",
                        horizontal: "center",
                      }}
                      badgeContent={message.fileType}
                    >
                      <InsertDriveFileOutlinedIcon fontSize="large" />
                    </Badge>
                  </div>
                  <div className="file-name">{message.fileName}</div>
                  <div className="file-size">{message.fileSize}</div>
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
                      onClick={handleClick}
                    >
                      <input
                        hidden
                        // types of files that are accepted
                        // add to include .pdf, .doc, .txt
                        inputProps={{ accept: "image/*" }}
                        id="file-input"
                        type="file"
                        ref={hiddenFileInput}
                        style={{ display: "none" }}
                        onChange={handleFileSubmit}
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
