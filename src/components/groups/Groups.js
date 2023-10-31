/**
 * User groups component
 */

import { Outlet } from "react-router-dom";
import { getGroups } from "../../utils/localStorage";
import { useEffect, useState } from "react";
import { getFriends } from "../../services/friendsAPI";

import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { useNavigate } from "react-router-dom";
import { useSocket } from "../../services/SocketContext";
import ManageMembersModal from "./ManageMembersModal";
import ManageGroupSettings from "./ManageGroupSettings";

/**
 * Builds and renders the User groups component
 * @returns User groups component render
 */
const Groups = ({ setRefresh, refresh, setHeaderTitle }) => {
  const [group, setGroup] = useState(null);
  const [friends, setFriends] = useState([]);

  const { socket } = useSocket(); // socket
  // state handler for groups settings modal
  const [manageMembersModalOpen, setManageMembersModalOpen] = useState(false);
  const [manageGroupSettingsModalOpen, setManageGroupSettingsModalOpen] =
    useState(false);

  const navigate = useNavigate();

  // fetch current group information + users
  useEffect(() => {
    // 1. find current group id
    const ID = window.location.pathname.split("/")[3];

    // 2. fetch groups data from local storage
    const groups = getGroups();
    console.log("HERE", groups);

    // 3. extract group with current ID
    groups.forEach((g) => {
      if (g.groupID === ID) {
        setGroup(g);
      }
    });

    // 4. define fetch friends function
    async function fetchFriends() {
      const response = await getFriends();
      console.log("FRIENDS: ", response);
      setFriends(response);
    }

    // 5. Fetch friends
    fetchFriends();

  }, [refresh]);

  // handles opening channel chat and relative functions
  const handleChannelNavigate = (channelID, channelName) => {
    console.log("opening channel chat with id ", channelID);
    // loading channel chat with a certain ID (which will be used to get the channel info)
    navigate(`/dashboard/groups/${group.groupID}/${channelID}`);
    // change header title to match channel
    if (channelName) {
      setHeaderTitle(channelName);
    }
  };

  console.log(group);

  return (
    <section className="group-page">
      {/* Manage group members modal & group settings modal render */}
      {group && (
        <>
          <ManageMembersModal
            manageMembersModalOpen={manageMembersModalOpen}
            setManageMembersModalOpen={setManageMembersModalOpen}
            members={group.GroupMembers}
            setRefresh={setRefresh}
            users={friends}
          />
          <ManageGroupSettings
            manageGroupSettingsModalOpen={manageGroupSettingsModalOpen}
            setManageGroupSettingsModalOpen={setManageGroupSettingsModalOpen}
            group={group}
          />
        </>
      )}

      {/* Group page render */}
      <div className="group-menu">
        <div>
          {/* General chats */}
          <h2>General</h2>
          <div className="group-options">
            <div className="group-option">
              <div>
                <ChatOutlinedIcon />
                <a onClick={() => handleChannelNavigate("", null)}>General</a>
              </div>
              <PersonAddOutlinedIcon
                id="manage-members-icon"
                onClick={setManageMembersModalOpen}
              />
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
            {group && group.Channel &&
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
        <div id="group-bttns" className="group-options">
          <button className="group-button" onClick={setManageMembersModalOpen}>
            <PersonAddOutlinedIcon />
            <h3>Manage members</h3>
          </button>
          <button
            className="group-button"
            onClick={setManageGroupSettingsModalOpen}
          >
            <SettingsOutlinedIcon />
            <h3>Group settings</h3>
          </button>
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
