/**
 * Group Chat component
 */

import {
  TextField,
  ButtonGroup,
  Box,
  Avatar,
  FormControl,
  Badge,
  Button,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";

// MUI components
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
import SoundFile from "../../assets/NewMsg.wav";

/**
 * Builds and renders the homepage component
 * @returns GroupChat component render
 */
const GroupChatUI = ({ socket }) => {
  //gets the friends from outlet in groups component
  const membersArray = Object.values(useOutletContext());
  const members = membersArray.flat();

  // socket.io functions
  const { loginSocket } = useSocket();
  // loading used as state to get information first before displaying chat
  const [loading, setLoading] = useState(true); // set loading to true

  // loop through sender id(by friends) and find their avatar
  const findAvatarBySenderID = (SenderID) => {
    const member = members.find((member) => member.AccountID === SenderID);

    return member ? member.avatar : null;
  };

  // console.log("memembers", members);

  // through the url params of -groupID and channelID return values
  const { groupId, channelId } = useParams(); // prefered method
  const [messagesAmmount, setMessagesAmmount] = useState(20);
  const groupID = groupId;
  const channelID = parseInt(channelId);
  // console.log("groupID...", groupID);
  // console.log("channelId...", channelID);
  // console.log("socket.accountID", socket.accountID);
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

  const handleMoreMessages = async () => {
    setMessagesAmmount((prevMessageAmmount) => prevMessageAmmount + 10);
    console.log("message ammount...", messagesAmmount);
    socket.emit("moreChannelMessages", { channelID, num: messagesAmmount });
  };

  const [NewMsgSound] = useState(new Audio(SoundFile));

  const playSound = () => {
    NewMsgSound.play();
  };

  // render on page chat
  useEffect(() => {
    setLoading(true); // loading
    const fetchData = async () => {
      try {
        // console.log("channel...");
        // check socket user credentials are still in socket
        if (socket.accountID !== undefined && channelID !== undefined) {
          // connect to channel
          socket.emit("connectChannel", { channelID: channelID });
          socket.on("messageHistory", (messages) => {
            // set messages recieved
            console.log("messages...", messages);
            setMessages(messages.flat().reverse());
            setLoading(false); //set loading as false
            // console.log("messages...", messages);
          });
          setMessagesAmmount(20);

          socket.emit("getChannelMessages", { channelID: channelID });
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
      } catch (error) {
        console.error("error getting channel info", error);
      }
    };
    fetchData();
  }, [socket, channelID]);

  useEffect(() => {
    //open listener on message response. for data
    socket.on("channelMessageResponse", (data) => {
      // console.log("recieved message response", data);
      playSound();

      // const messageRecieved = dayjs(new Date());
      const formatMessage = {
        SenderID: data.from,
        MessageBody: data.message,
        SenderUsername: data.username,
        TimeSent: formatDateTime(data.timestamp),
      };
      // set messages
      setMessages((messages) => [...messages, formatMessage]);
    });

    return () => {
      socket.off("channelMessageResponse");
    };
  }, [socket, messages]);

  //handle auto-scrolling to latest message
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //Message submit handling
  const handleMessageSubmit = (event) => {
    event.preventDefault();
    // console.log("Message Handler");
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

  // NOT IMPLMENTED
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
          <p>Please Select a Channel...</p>
        </div>
      ) : (
        <div className="chat-messages">
          <Button onClick={handleMoreMessages}>more messages</Button>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-content-${
                message.SenderID === userId ? "user" : "other"
              }`}
            >
              {/* SenderUsername */}
              <div>{message.SenderUsername}</div>
              {/* timestamp */}
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
                  // renders avatar
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
          <div ref={lastMessageRef} />
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
