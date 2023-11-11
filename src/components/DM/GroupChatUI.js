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

// useParams can be used to get the url id
import { useParams, useOutletContext } from "react-router-dom";
import { useSocket } from "../../services/SocketContext";
import { getUserID, getUser } from "../../utils/localStorage";

/**
 * Builds and renders the homepage component
 * @returns Homepage component render
 */
const GroupChatUI = () => {
  const friendsArray = Object.values(useOutletContext());
  const friends = friendsArray.flat();
  // console.log("friends > ", friends);

  // used for re-seating socket
  const { loginSocket, socket } = useSocket();
  const [loading, setLoading] = useState(true); // set loading to true

  // loop through sender id(by friends) and find their avatar
  const findAvatarBySenderID = (SenderID) => {
    const friend = friends.find((friend) => friend.AccountID === SenderID);
    return friend ? friend.Avatar : null;
  };

  // through the url params of groupID and channelID return values
  const { groupId, channelId } = useParams(); // prefered method
  console.log("inside group chat....");

  const groupID = groupId;
  const channelID = parseInt(channelId);
  console.log("groupID...", groupID);
  console.log("channelId...", channelID);
  console.log("socket.accountID", socket.accountID);
  // messages
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // const [selectedFile, setSelectedFile] = useState(null);
  // const hiddenFileInput = useRef(null);
  const lastMessageRef = useRef(null); // for scrolling to latest message

  // getting local user
  const userId = getUserID();
  const username = getUser();

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
    console.log("channel...");
    // check socket user credentials are still in socket
    if (socket.accountID !== undefined) {
      // connect to channel
      

      // open listener of messageHistory for messages
      socket.on("messageHistory", (messages) => {
        // set messages recieved
        setMessages(messages.flat().reverse());
        setLoading(false); //set loading as false
      });

      //open listener on message response. for data
      socket.on("channelMessageResponse", (data) => {
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
      socket.emit("connectChannel", { channelID });
      // ask for messages after delay
      const timeoutId = setTimeout(() => {
        console.log("2 seconds later...")
            }, 2000);
      socket.emit("getChannelMessages", { channelID });
    } else {
      // attempt to reconnect socket
      handleReconnect();
    }
    // close listeners
    return () => {
      setMessages(null);
      socket.off("messageHistory");
      socket.off("channelMessageResponse");
    };
    }, [channelID, socket]);

  //handle auto-scrolling to latest message
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //Message submit handling
  const handleMessageSubmit = (event) => {
    event.preventDefault();
    console.log("Message Handler");
    const newTimestamp = new Date().getTime(); // converts to epoch time
    const messageText = messageInput.toString(); // convert user input to string

    if (messageText.trim() !== "") {
      // currently being used for local display
      const newMessage = {
        ChannelID: channelID,
        MessageBody: messageText,
        SenderID: userId,
        TimeSent: newTimestamp,
      };

      // sending > emit message of chatID and string of message
      socket.emit("sendChannelMessage", {
        channelID: channelID,
        message: messageText,
      });

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
      {loading ? (
        <div>
          <p>Loading messages...</p>
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
              <div>{message.SenderID}</div>

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
export default GroupChatUI;
