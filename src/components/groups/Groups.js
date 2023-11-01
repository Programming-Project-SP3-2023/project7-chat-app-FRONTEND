/**
 * User groups component
 */

import { Outlet } from "react-router-dom";
import { getGroups, getUserID } from "../../utils/localStorage";
import { useEffect, useState } from "react";
import { getFriends } from "../../services/friendsAPI";
import CROWN from "../../assets/crown.png";

import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { useNavigate } from "react-router-dom";
import { useSocket } from "../../services/SocketContext";
import ManageMembersModal from "./ManageMembersModal";
import ManageGroupSettings from "./ManageGroupSettings";

/**
 * Builds and renders the User groups component
 * @returns User groups component render
 */
const Groups = ({
  setRefresh,
  refresh,
  setHeaderTitle,
  groupReload,
  setGroupReload,
}) => {
  const [group, setGroup] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [members, setMembers] = useState([]);

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
    let currentGroup;

    // 3. extract group with current ID
    groups.forEach((g) => {
      if (g.groupID === ID) {
        currentGroup = g;
        setGroup(g);
        setMembers(currentGroup.GroupMembers);
      }
    });

    // 4. Check if User is this group's admin
    members.forEach((m) => {
      if (m.AccountID === getUserID()) {
        if (m.Role === "Admin") setIsAdmin(true);
      }
    });

    // 4. define fetch friends function
    async function fetchFriends() {
      const response = await getFriends();
      console.log("FRIENDS: ", response);
      setFriends(response);
    }
    // 5. Call function
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
            members={members}
            setMembers={setMembers}
            setRefresh={setRefresh}
            friends={friends}
            groupID={group.groupID}
            groupReload={groupReload}
            setGroupReload={setGroupReload}
          />
          <ManageGroupSettings
            manageGroupSettingsModalOpen={manageGroupSettingsModalOpen}
            setManageGroupSettingsModalOpen={setManageGroupSettingsModalOpen}
            group={group}
            groupReload={groupReload}
            setGroupReload={setGroupReload}
          />
        </>
      )}

      {/* Group page render */}
      <div className="group-menu">
        <div>
          {isAdmin && (
            <div className="group-admin-flag">
              {/* <a href="https://www.flaticon.com/free-icons/crown" title="crown icons">Crown icons created by Freepik - Flaticon</a> */}
              <img src={CROWN} alt="crown" />
              <h4>You are this group's admin</h4>
            </div>
          )}
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
            {group &&
              group.Channel &&
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
        {isAdmin && (
          <div id="group-bttns" className="group-options">
            <button
              className="group-button"
              onClick={setManageMembersModalOpen}
            >
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
        )}
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
