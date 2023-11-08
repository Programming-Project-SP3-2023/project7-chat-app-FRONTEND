/**
 * User groups component
 */

import { Outlet } from "react-router-dom";
import { getGroups, getUserID } from "../../utils/localStorage";
import { useEffect, useState } from "react";
import { getFriends } from "../../services/friendsAPI";
import { getChannelList } from "../../services/channelsAPI";
import CROWN from "../../assets/crown.png";

import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import WorkspacesOutlinedIcon from "@mui/icons-material/WorkspacesOutlined";

import { useNavigate } from "react-router-dom";
import { useSocket } from "../../services/SocketContext";
import ManageChannelModal from "./ManageChannelModal";
import ManageMembersModal from "./ManageMembersModal";
import ManageGroupSettings from "./ManageGroupSettings";
import AddChannelModal from "./AddChannelModal";
import { UndoRounded } from "@mui/icons-material";
import { getUser } from "../../utils/localStorage";

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
  socket,
}) => {
  const [group, setGroup] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [members, setMembers] = useState([]);

  const [channelList, setChannelList] = useState(null);
  const [channelId, setChannelId] = useState(null); //

  const user = getUser(); // user
  const userID = getUserID(); // userid

  const { loginSocket } = useSocket(); // socket
  // state handler for groups settings modal
  const [manageMembersModalOpen, setManageMembersModalOpen] = useState(false);
  const [manageGroupSettingsModalOpen, setManageGroupSettingsModalOpen] =
    useState(false);
  // state handler for channel modal
  const [manageChannelsModalOpen, setManageChannelsModalOpen] = useState(false);
  const [manageAddChannelModalOpen, setManageAddChannelModalOpen] =
    useState(false);

  const navigate = useNavigate();

  // fetch current group information + users
  useEffect(() => {
    const fetchData = async () => {
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
          console.log("THIS is USERID:", m.AccountID);
          console.log("THIS IS my role", m.Role);
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
      await fetchFriends();

      // 6 attempt to get channel list
      async function fetchChannelList() {
        const response = await getChannelList();
        console.log("Channels List: ", response);
        setChannelList(response);
      }
      // 7 call channel list function
      await fetchChannelList();
    };
    fetchData();
  }, [refresh]);

  // handles opening channel chat and relative functions
  const handleChannelNavigate = async (channelID, channelName) => {
    // connect chat promise
    const joinChatPromise = new Promise((resolve, reject) => {
      // ask to join channel
      socket.emit("connectChannel", { channelID });
      // listens for connectchannelResponse
      socket.on("connectChannelResponse", () => {
        resolve();
      });
      // if an error is returned it has failed to join
      socket.on("error", (error) => {
        reject(error);
      });
      // timeout response
      setTimeout(() => {
        reject("Socket failed to join channel chat in time.");
      }, 5000);
    });

    try {
      //if promise is resolved navigate to channel
      await joinChatPromise;
      // loading channel chat with a certain ID (which will be used to get the channel info)
      navigate(`/dashboard/groups/${group.groupID}/${channelID}`);
      // change header title to match channel
      if (channelName) {
        setHeaderTitle(channelName);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // if group exists
    if (group) {
      // attempt to connect
      const connectGroupAsync = async () => {
        // check to see if accountID still conntected & groupID exists
        if (socket.accountID !== undefined && group.groupID !== null) {
          // attempt to connect to the group
          await socket.emit("connectGroup", { groupID: group.groupID });
        } else {
          // re-establish socket info
          await loginSocket(userID, user.username);
        }
      };
      connectGroupAsync();
    }

    //is dependent on the group existing
  }, [socket.accountID, group]);

  console.log("group info", group);

  return (
    <section className="group-page">
      {/* Manage group members modal & group settings modal render */}
      {group && (
        <>
          <AddChannelModal
            manageAddChannelModalOpen={manageAddChannelModalOpen}
            setManageAddChannelModalOpen={setManageAddChannelModalOpen}
            setRefresh={setRefresh}
            group={group}
            friends={friends}
            groupReload={groupReload}
            setGroupReload={setGroupReload}
          />

          <ManageChannelModal
            manageChannelModalOpen={manageChannelsModalOpen}
            setManageChannelModalOpen={setManageChannelsModalOpen}
            setRefresh={setRefresh}
            channelID={channelId} // currently null value
            group={group}
            friends={friends}
            groupReload={groupReload}
            setGroupReload={setGroupReload}
          />

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
                {/* TEMPORARY set to 10 until channels are implemented */}
                {/* will be expecint a channel id once implemented */}
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
                    {/* manage channel modal */}
                    <PersonAddOutlinedIcon
                      id="manage-members-icon"
                      onClick={setManageChannelsModalOpen}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        {isAdmin && (
          <div id="group-bttns" className="group-options">
            {/* addChannel Modal */}
            <button
              className="group-button"
              // onClick={setManageChannelsModalOpen}
              onClick={setManageAddChannelModalOpen}
            >
              <WorkspacesOutlinedIcon />
              <h3>Add channel</h3>
            </button>
            {/* manage memebers modal */}
            <button
              className="group-button"
              onClick={setManageMembersModalOpen}
            >
              <PersonAddOutlinedIcon />
              <h3>Manage members</h3>
            </button>
            {/* manage group settings modal */}
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
        {/* if we want ^^^ to happen it would be required to navigate to the channel */}
        <Outlet context={friends} />
      </div>
    </section>
  );
};

//Export the User groups component
export default Groups;
