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
import { useSocket } from "../../services/SocketContext";

/**
 * Builds and renders the homepage component
 * @returns Homepage component render
 */
const ChatUI = () => {
  const { socket } = useSocket();
  const userId = getUserID();
  const { id } = useParams(); // gets id from url id

  // Props for messages
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingStatus, setTypingStatus] = useState("");
  const [messageId, setMessageId] = useState(1);

  // console.log("socket userID: " + userId); //test to see if user socket is still connected

  // latest ref to scroll to latest message sent
  const lastMessageRef = useRef(null);

  // TODO sort message display // error handling
  //for handling message display from server
  // useEffect(() => {
  //   socket.on("messageHistory", ({ messages }) => {
  //     if (messages !== null) {
  //       setMessages(messages);
  //     }
  //   });
  // });

  // attempt to clear message each time a new chat is loaded
  useEffect(() => {
    setMessages([]);
  }, [id]);

  // handle auto-scrolling to latest message
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // for recieving typing
  useEffect(() => {
    socket.on("typing", (data) =>
      socket.broadcast.emit("typingResponse", data)
    );

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
    };
  });

  // for emiting typing
  const handleTyping = () => {
    socket.emit("typing", { userId });
  };

  //Message submit handling
  const handleMessageSubmit = (event) => {
    event.preventDefault();
    console.log("Message Handler");
    const newTimestamp = dayjs(new Date());
    console.log("userID: " + userId);
    const TimeSent = new dayjs().format("YYYY-MM-DDTHH:mm.ssZ");

    const newMessage = {
      Message: messageId,
      ChatID: id,
      MessageBody: messageInput,
      SenderID: userId,
      TimeSent: newTimestamp,
    };
    console.log("new Timestamp: " + TimeSent);
    socket.emit("privateMessage", {
      newMessage,
      TimeSent,
    });
    // socket.emit(id).emit("messageResponse", { message: newMessage });

    setMessages([...messages, newMessage]);
    setMessageId(messageId + 1);
    setMessageInput("");
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
          MessageID: messageId,
          Image: file,
          SenderID: userId,
          TimeSent: newTimestamp,
        };
        socket.emit("privateMessage", { message: newImage });
      } else {
        console.log("randomfile");

        const newFile = {
          MessageID: messageId,
          File: file,
          FileName: file.name,
          FileType: file.type.split("/")[1], // file type is not currently simple name
          FileSize: file.size, // currently passing file size in bytes
          SenderID: userId,
          TimeSent: newTimestamp,
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
                      onClick={handleClick}
                    >
                      <input
                        hidden
                        // types of files that are accepted
                        // add to include .pdf, .doc, .txt
                        accept="image/*"
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
