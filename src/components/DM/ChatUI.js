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
  // Badge,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
// import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

// date time formatter
import dayjs from "dayjs";

/**
 * Builds and renders the homepage component
 * @returns Homepage component render
 */
const ChatUI = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const hiddenFileInput = useRef(null);
  const username = socket.id; //temporary

  const [selectedFile, setSelectedFile] = useState(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

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

  //TODO change to except specific user
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

      if (selectedFile) {
        socket.emit("message", {
          user: username,
          image: selectedFile,
          timestamp: newTimestamp,
          socketID: socket.id,
        });
      }

      setMessageInput("");
      setSelectedFile(null);
    }
  };

  const handleFileSubmit = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
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
      <div className="chat-messages">
        {messages.map((message) =>
          message.name === localStorage.getItem("user") ? (
            <div className="message-content" key={message.id}>
              <div className="message-timestamp">
                {formatDateTime(messages.timestamp)}
              </div>
              {message.text && (
                <div className="message-user">
                  <Avatar
                    alt={`User ${message.user}`}
                    src={message.userAvatar}
                  />
                  <div id="message">{message.text}</div>
                  <div className="message-content-user">
                    {/* renders chat message */}

                    {messages.text}
                  </div>
                </div>
              )}

              {/* renders image if available */}
              {message.image && (
                <div
                  id="message-image-container other"
                  className={`message-image-container other`}
                >
                  <img
                    id="message-image other"
                    className={`message-image other`}
                    src={message.image}
                    alt={message.image}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="message-content" key={message.id}>
              <div className="message-timestamp">
                {formatDateTime(messages.timestamp)}
              </div>
              {message.text && (
                <div className="message-other">
                  <Avatar
                    alt={`User ${message.user}`}
                    src={message.userAvatar}
                  />
                  <div id="message-other">{message.text}</div>
                  <div className="message-content-other">
                    {/* renders chat message */}

                    {messages.text}
                  </div>
                </div>
              )}

              {/* renders image if available */}
              {message.image && (
                <div id="image" className={`message-other`}>
                  <img
                    className={`message-other`}
                    src={message.image}
                    alt={message.image}
                  />
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* need to have the current text */}
      <div className="message__status">
        <p>Someone is typing...</p>
      </div>
      <form id="chat-input-container" onSubmit={handleMessageSubmit}>
        <FormControl fullWidth>
          <div className="chat-input">
            <TextField
              fullWidth
              id="chat-input"
              variant="outlined"
              label="Type a Message"
              onChange={(event) => setMessageInput(event.target.value)}
              type="text"
              placeholder="Type a Message"
              value={messageInput}
              InputProps={{
                endAdornment: (
                  <ButtonGroup>
                    <IconButton
                      className="image-select-button"
                      onClick={handleClick}
                    >
                      <input
                        hidden
                        accept="image/*"
                        id="file-input"
                        type="file"
                        ref={hiddenFileInput}
                        style={{ display: "none" }}
                        onChange={handleFileSubmit}
                      />
                      <AttachFileIcon />
                    </IconButton>
                    <IconButton type="submit">
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
