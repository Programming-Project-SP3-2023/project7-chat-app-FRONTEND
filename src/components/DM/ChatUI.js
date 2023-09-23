/**
 * Homepage component
 */

import {
  TextField,
  ButtonGroup,
  Box,
  Divider,
  Avatar,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

// date time formatter
import dayjs from "dayjs";


import ECHO_AVATAR from "../../assets/1.JPG";

/**
 * Builds and renders the homepage component
 * @returns Homepage component render
 */
const ChatUI = () => {
  const [messageInput, setMessageInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [messages, setMessages] = useState([
    // dummy messages

    {
      user: 0,
      text: "Hey Captain, when are we getting the new recruits???",
      sender: "message_recived",

      timestamp: "2023-07-01 17:03",


      userAvatar: ECHO_AVATAR,
    },
    {
      user: 1,
      text: "Dear Jake, This has yet to be confirmed. Sincerely Raymond Holt",
      sender: "message_sent",

      timestamp: "2023-07-02 17:03",

    },
    {
      user: 1,
      text: "Dear Jake, Please report to my office immerdiately, there has been a break-in and there are some high profile individuals involved. Sincerely, Raymond Holt",
      sender: "message_sent",

      timestamp: "2023-09-19 17:03",
      file: "not_a_real_file.txt",

    },
    {
      user: 0,
      text: "Hey what do you think of my new photo? Cool right?",
      sender: "message_recived",
      timestamp: "2023-09-19 17:03",
      userAvatar: ECHO_AVATAR,
      // currently using random image for css styling
      image: "https://source.unsplash.com/random",
    },
    {
      user: 1,
      text: "Dear Jake, why is no one having a good time? I specifically requested it",
      sender: "message_sent",
      timestamp: "2023-09-19 17:03",
      userAvatar: ECHO_AVATAR,
      // currently using random image for css styling
      image: "https://source.unsplash.com/random",
    },
  ]);

  //TODO change to except specific user
  const handleMessageSubmit = (event) => {
    event.preventDefault();
    console.log("Message Handler");

    const newTimestamp = dayjs(new Date());
    console.log(newTimestamp);

    if (messageInput.trim() !== "") {
      const newMessage = {
        user: 1,
        text: messageInput,
        sender: "message_sent",
        timestamp: newTimestamp,
      };

      if (selectedFile) {
        newMessage.image = selectedFile;
      }

      setMessages([...messages, newMessage]);
      // reset values
      setMessageInput("");
      setSelectedFile(null);
    }
  };

  const handleFileSubmit = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
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

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflow: "auto",
      }}
      id="chat-ui-container"
    >
      <div id="chat-messages">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === "message_recived" ? "user" : "other"
            }`}
          >
            <div id="message-timestamp" className="message-timestamp">
              {formatDateTime(message.timestamp)}
            </div>
            <div className="message-content">
              {/* renders chat message */}
              {message.userAvatar && (
                <Avatar alt={`User ${message.user}`} src={message.userAvatar} />
              )}
              {message.text}
            </div>
            {/* renders image if available */}
            {message.image && (
              <div
                id="message-image-container"
                className={`message-image-container ${
                  message.sender === "message_recived" ? "user" : "other"
                }`}
              >
                <img
                  id="message-image"
                  className={`message-image ${
                    message.sender === "message_recived" ? "user" : "other"
                  }`}
                  src={message.image}
                  alt={message.image}
                />
              </div>
            )}
            {/* renders file if available */}
            {message.file && (
              <div>
                <p>Need to figure out how to do this!</p>
              </div>
            )}
          </div>
        ))}
        <div id="chat-divider-container">
          <p>Today</p>
          <Divider id="chat-divider" variant="middle" color="black" />
        </div>
      </div>

      {/* need to have the current text */}
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
                    <IconButton>
                      <input
                        hidden
                        accept="image/*"
                        id="file-input"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileSubmit}
                      />
                      <AttachFileIcon htmlFor="file-input" />
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
