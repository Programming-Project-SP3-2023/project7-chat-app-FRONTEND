/**
 * Homepage component
 */

import {
  Button,
  TextField,
  ButtonGroup,
  Box,
  Divider,
  Avatar,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
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
    },
    {
      user: 0,
      text: "Hey what do you think of my new photo? Cool right?",
      sender: "message_recived",
      timestamp: "2023-09-19 17:03",
      userAvatar: ECHO_AVATAR,
    },
  ]);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    console.log("Message Handler");

    const newTimestamp = dayjs(new Date());

    if (messageInput.trim() !== "") {
      const newMessage = {
        user: 1,
        text: messageInput,
        sender: "message_sent",
        timestamp: newTimestamp,
      };

      setMessages([...messages, newMessage]);
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
      formatTimestamp = dayjs(timestamp).format("ddd D MMM | HH:mm");
    }

    return formatTimestamp;
  };

  return (
    // need to include time stamp

    <Box
      sx={{
        height: 600,
        width: "100%",
        overflow: "auto",
      }}
      class="chat-ui-container"
    >
      <div className="chat-messages" id="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === "message_recived" ? "user" : "other"
            }`}
          >
            <div className="message-timestamp">
              {formatDateTime(message.timestamp)}
            </div>
            <div className="message-content">
              {message.userAvatar && (
                <Avatar alt={`User ${message.user}`} src={message.userAvatar} />
              )}
              {message.text}
            </div>
          </div>
        ))}

        <p>Today</p>
        <Divider id="chat-divider" variant="middle" color="black" />
      </div>

      {/* need to have the current text */}
      <form onSubmit={handleMessageSubmit}>
        <FormControl
          class="chat-input-container"
          className="chat-input-contaienr"
        >
          <div className="chat-input">
            <TextField
              fullWidth
              id="chat-input"
              variant="outlined"
              label="Type a Message"
              onChange={(event) => setMessageInput(event.target.value)}
              type="text"
              placeholder="Type a Message"
              InputProps={{
                endAdornment: (
                  <ButtonGroup>
                    <Button>
                      <AttachFileIcon color="primary" />
                    </Button>
                    <Button type="submit">
                      <SendIcon />
                    </Button>
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
