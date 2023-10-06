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
import { useState, useEffect } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
// import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { useNavigate } from "react-router-dom";

// date time formatter
import dayjs from "dayjs";

/**
 * Builds and renders the homepage component
 * @returns Homepage component render
 */
const ChatUI = ({ socket }) => {
  const navigate = useNavigate();

  // const handleLeaveChat = () => {
  //   localStorage.removeItem("username");
  //   navigate("/");
  //   window.location.reload();
  // };

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const username = socket.id; //temporary

  // const [selectedFile, setSelectedFile] = useState(null);

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
        sender: "message_sent",
        timestamp: newTimestamp,

        socketID: socket.id,
      });

      // if (selectedFile) {
      //   newMessage.image = selectedFile;
      // }

      // socket.emit([...messages, newMessage]);

      // setMessages((prevMessages) => [...prevMessages, newMessage]);
      // reset values
      setMessageInput("");
      // setSelectedFile(null);
    }
  };

  // const handleFileSubmit = (event) => {
  //   const file = event.target.files[0];
  //   setSelectedFile(file);
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
      <div id="chat-messages" className="message__container">
        {messages.map((message) =>
          message.name === localStorage.getItem("username") ? (
            <div className="message__chats" key={message.id.time}>
              {formatDateTime(message.timestamp)}
              <p className="sender__name">You</p>
              <div className="message__sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <div id="message-timestamp" className="message-timestamp">
                {formatDateTime(message.timestamp)}
              </div>
              <p>{message.name}</p>
              <div className="message__recipient">
                <Avatar alt={`User ${message.user}`} src={message.userAvatar} />
                <div className="message-content">{message.text}</div>
              </div>
            </div>
          )
        )}
      </div>

      {/* need to have the current text */}
      {/* <div className="message__status">
        <p>Someone is typing...</p>
      </div> */}
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
                        // onChange={handleFileSubmit}
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
