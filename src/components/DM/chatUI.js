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
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";

import ECHO_AVATAR from "../../assets/1.JPG";

/**
 * Builds and renders the homepage component
 * @returns Homepage component render
 */
const ChatUI = () => {
  // Dummy Messages
  const messages = [
    {
      user: 0,
      text: "Hey Captain, when are we getting the new recruits???",
      sender: "message_recived",
      userAvatar: ECHO_AVATAR,
    },
    {
      user: 1,
      text: "Dear Jake, This has yet to be confirmed. Sincerely Raymond Holt",
      sender: "message_sent",
    },
    {
      user: 1,
      text: "Dear Jake, Please report to my office immerdiately, there has been a break-in and there are some high profile individuals involved. Sincerely, Raymond Holt",
      sender: "message_sent",
    },
    {
      user: 0,
      text: "Hey what do you think of my new photo? Cool right?",
      sender: "message_recived",
      userAvatar: ECHO_AVATAR,
    },
  ];

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
            {message.userAvatar && (
              <Avatar alt={`User ${message.user}`} src={message.userAvatar} />
            )}

            {message.text}
          </div>
        ))}

        <p>Today</p>
        <Divider id="chat-divider" variant="middle" color="black" />
      </div>

      {/* need to have the current text */}
      <div class="chat-input-container">
        <TextField
          fullWidth
          id="chat-input"
          variant="outlined"
          label="Type a Message"
          // onChange={(event) => setSendMessage(event.target.value)}
          type="text"
          placeholder="Type a Message"
          InputProps={{
            endAdornment: (
              <ButtonGroup>
                <Button>
                  <AttachFileIcon color="primary" />
                </Button>
                <Button>
                  <SendIcon />
                </Button>
              </ButtonGroup>
            ),
          }}
        />
      </div>
    </Box>
  );
};

//Export the homepage component
export default ChatUI;
