/**
 * User groups component
 */

import { Outlet } from "react-router-dom";
import { getGroups } from "../../utils/localStorage";
import { useEffect, useState } from "react";

import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../services/SocketContext";

/**
 * Builds and renders the User groups component
 * @returns User groups component render
 */
const Groups = ({ refresh, setHeaderTitle }) => {
  const [group, setGroup] = useState(null);
  const { socket } = useSocket(); // socket
  const navigate = useNavigate();

  // fetch current group information
  useEffect(() => {
    // 1. find current group id
    const ID = window.location.pathname.split("/")[3];

    // 2. fetch groups data from local storage
    const groups = getGroups();

    // 3. extract group with current ID
    groups.forEach((g) => {
      if (g.GroupID === ID) {
        setGroup(g);
      }
    });
  }, [refresh]);

  // handles opening channel chat and relative functions
  const handleChannelNavigate = (channelID, channelName) => {
    console.log("opening channel chat with id ", channelID);
    // loading channel chat with a certain ID (which will be used to get the channel info)
    navigate(`/dashboard/groups/${group.GroupID}/${channelID}`);
    // change header title to match channel
    if (channelName) {
      setHeaderTitle(channelName);
    }
  };

  console.log(group);

  return (
    <section className="group-page">
      <div className="group-menu">
        {/* General chats */}
        <h2>General</h2>
        <div className="group-options">
          <div className="group-option">
            <div>
              <ChatOutlinedIcon />
              <a onClick={() => handleChannelNavigate("", null)}>General</a>
            </div>
            <PersonAddOutlinedIcon />
          </div>
          <div className="group-option">
            <div>
              <HeadphonesOutlinedIcon />
              <a>Meeting Room</a>
            </div>
          </div>
        </div>
        {/* Channels */}
        <h2 id="channels-title">Channels</h2>
        <div className="group-options">
          {group &&
            group.Channels.map((channel) => (
              <div className="group-option">
                <div>
                  {channel.ChannelType === "Text" ? (
                    <ChatOutlinedIcon />
                  ) : (
                    <HeadphonesOutlinedIcon />
                  )}
                  <a
                    onClick={() =>
                      handleChannelNavigate(
                        channel.ChannelID,
                        channel.ChannelName
                      )
                    }
                  >
                    {channel.ChannelName}
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="group-chat-area">
        {/* By default it loads the general chat */}
        <Outlet />
      </div>
    </section>
  );
};

//Export the User groups component
export default Groups;
