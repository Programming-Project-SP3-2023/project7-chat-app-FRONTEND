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

/**
 * Builds and renders the homepage component
 * @returns Homepage component render
 */
const ChatUI = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingStatus, setTypingStatus] = useState("");

  // image related
  const [selectedFile, setSelectedFile] = useState(null);
  const hiddenFileInput = useRef(null);

  // for autoscrolling to the latest message
  const lastMessageRef = useRef(null);
  const username = socket.id; //tempory accesor to access socket id as user.

  const handleTyping = () => {
    socket.emit("typing", `${localStorage.getItem("user")} is typing`);
  };

  //image file button click
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  // TODO handle image rendering in useEffect > messageResponse

  // for handling message display
  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  // for handling auto-scrolling of lastest message (into scrollIntoView)
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  //Message submit handling
  const handleMessageSubmit = (event) => {
    event.preventDefault();

    console.log("Message Handler");

    const newTimestamp = dayjs(new Date());
    console.log(newTimestamp);

    if (messageInput.trim() !== "") {
      socket.emit("message", {
        user: username,
        text: messageInput,
        timestamp: newTimestamp,
        socketID: socket.id,
      });

      setMessageInput("");
    }
  };

  //Image submit handling
  const handleFileSubmit = (event) => {
    event.preventDefault();

    const newTimestamp = dayjs(new Date());
    const file = event.target.files[0];

    if (file) {
      if (file.type && file.type.startsWith("image/")) {
        console.log("image");
        socket.emit("message", {
          user: username,
          image: file,
          timestamp: newTimestamp,
          socketID: socket.id,
        });
      } else {
        console.log("randomfile");
        socket.emit("message", {
          user: username,
          file: file,
          fileName: file.name,
          fileType: file.type.split("/")[1], // file type is not currently simple name
          fileSize: file.size, // currently passing file size in bytes
          timestamp: newTimestamp,
          socketID: socket.id,
        });
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
          message.name === localStorage.getItem("user") ? ( //currently gets local stored user
            <div
              ref={lastMessageRef}
              className="message-content"
              key={`user-message-${index}`}
            >
              <div className="message-timestamp">
                {formatDateTime(messages.timestamp)}
              </div>
              {/* message only rendering */}
              {message.text && (
                <div className="message-user">
                  <div id="message">{message.text}</div>
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
                {formatDateTime(messages.timestamp)}
              </div>
              {/* renders text if available */}
              {message.text && (
                <div className="message-other">
                  <Avatar
                    alt={`User ${message.user}`}
                    src={message.userAvatar}
                  />
                  <div id="message">{message.text}</div>
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
                        inputProps={{ accept: "image/*, .pdf, .doc, .txt" }}
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
