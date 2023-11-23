/**
 * User groups component
 */

import { Outlet, useParams } from "react-router-dom";
import { getUserID } from "../../utils/localStorage";
import { useEffect, useState } from "react";
import { getFriends } from "../../services/friendsAPI";
import { getChannels } from "../../services/channelsAPI";
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
import { getUser, getGroups } from "../../utils/localStorage";

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
  // group id from url params
  const { groupId } = useParams();

  // group related
  const [group, setGroup] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [members, setMembers] = useState([]);
  // potential members
  const [friends, setFriends] = useState([]);
  // channel related
  const [channelList, setChannelList] = useState(null);
  const [selectChannelIdModal, setSelectChannelIdModal] = useState(null);
  const navigate = useNavigate();

  // user related
  const user = getUser(); // user
  const userID = getUserID(); // userid

  // socket.io functions
  const { loginSocket } = useSocket();

  // state handler for groups settings modal
  const [manageMembersModalOpen, setManageMembersModalOpen] = useState(false);
  const [manageGroupSettingsModalOpen, setManageGroupSettingsModalOpen] =
    useState(false);

  // state handler for channel modal
  const [manageChannelsModalOpen, setManageChannelsModalOpen] = useState(false);
  const [manageAddChannelModalOpen, setManageAddChannelModalOpen] =
    useState(false);

  const [loading, setloading] = useState(true);

  // channel settings modal handler
  const handleOpenManageChannelsModal = (channelID) => {
    setSelectChannelIdModal(channelID);
    setManageChannelsModalOpen(true);
  };

  // fetch current group information + users
  useEffect(() => {
    try {
      const fetchData = async () => {
        // 1. fetch groups data from local storage
        async function fetchGroups() {
          let currentGroup = null;
          const groups = await getGroups();

          if (groups !== null) {
            // 2. extract group with current ID
            groups.forEach((g) => {
              if (g.groupID === groupId) {
                currentGroup = g;
                setGroup(g);
                setMembers(currentGroup.GroupMembers);
              }
            });
          }
          // error
          if (!currentGroup) {
            console.error("group not found with ID:", groupId);
            return;
          }
        }

        // 3. define fetch friends function // potential group members
        async function fetchFriends() {
          const response = await getFriends();
          setFriends(response);
        }

        // 4. attempt to get channel list
        async function fetchChannelList() {
          if (groupId) {
            const response = await getChannels(groupId);
            console.log("Channels List: ", response);

            response.forEach((ch) => {
              socket.emit("connectChannel", ch.ChannelID);
            }, 2000);

            setChannelList(response);
          } else {
            console.error("group or groupId is null...");
          }
        }

        // 5 call channel list function async functions
        await fetchGroups();
        await fetchFriends();
        await fetchChannelList();
      };
      // call for data
      fetchData();
    } catch (error) {
      console.log("error", error);
    } finally {
      setloading(false);
    }
  }, [groupId]);

  // updates the users role when members are avaiable
  useEffect(() => {
    async function fetchMembers() {
      //check for member roles
      members.forEach((m) => {
        if (m.AccountID === getUserID()) {
          if (m.Role === "Admin") setIsAdmin(true);
          else setIsAdmin(false);
        }
      });
    }
    fetchMembers();
  }, [members]);

  // handles opening channel chat and relative functions
  const handleChannelNavigate = async (channelID, channelName) => {
    // change header title to match channel
    if (channelName) {
      setHeaderTitle(channelName);
    }
    // connect chat promise
    const joinChatPromise = new Promise((resolve, reject) => {
      // ask to join channel
      socket.emit("connectChannel", { channelID });

      const connectChannelResponseHandler = () => {
        socket.off("connectChannelResponse", connectChannelResponseHandler);
        resolve();
      };

      // listens for connectchannelResponse
      socket.on("connectChannelResponse", connectChannelResponseHandler);
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

  // handle voip join
  const handleVOIPJoin = (channelID, channelName) => {
    navigate(`/dashboard/groups/${group.groupID}/v/${channelID}`);
    if (channelName) {
      setHeaderTitle(channelName);
    }
  };

  useEffect(() => {
    // if group exists
    if (group !== null) {
      // attempt to connect
      const connectGroupAsync = async () => {
        // check to see if accountID still conntected & groupID exists
        if (socket.accountID !== undefined && group.groupID !== null) {
          // attempt to connect to the group
          await socket.emit("connectGroup", { groupID: group.groupID });
        } else {
          // re-establish socket info
          // console.log("WE ARE RELOGGING INTO SOCKET");
          await loginSocket(userID, user.username);
        }
      };
      connectGroupAsync();
    }
    //is dependent on the group existing
  }, [group]);

  return (
    <>
      {loading ? (
        <div>
          <p>Loading Group Info</p>
        </div>
      ) : (
        <section className="group-page">
          {/* Manage group members modal & group settings modal render */}

          {group && (
            <>
              <AddChannelModal
                manageAddChannelModalOpen={manageAddChannelModalOpen}
                setManageAddChannelModalOpen={setManageAddChannelModalOpen}
                setRefresh={setRefresh}
                group={group}
                channels={channelList}
                members={members}
                groupReload={groupReload}
                setGroupReload={setGroupReload}
              />

              <ManageChannelModal
                manageChannelModalOpen={manageChannelsModalOpen}
                setManageChannelModalOpen={setManageChannelsModalOpen}
                setRefresh={setRefresh}
                channelID={selectChannelIdModal}
                channels={channelList}
                group={group}
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
                setManageGroupSettingsModalOpen={
                  setManageGroupSettingsModalOpen
                }
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
              {/* Channels */}
              <h2>Channels</h2>
              <div className="group-options">
                {channelList &&
                  channelList.map((channel) => (
                    <div className="group-option" key={channel.ChannelID}>
                      <div>
                        {channel.ChannelType === "Chat" ? (
                          <div>
                            <ChatOutlinedIcon />
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
                            {isAdmin && (
                              <PersonAddOutlinedIcon
                                id="manage-members-icon"
                                onClick={() =>
                                  handleOpenManageChannelsModal(
                                    channel.ChannelID
                                  )
                                }
                              />
                            )}
                          </div>
                        ) : channel.ChannelType === "Voice" ? (
                          <div>
                            <HeadphonesOutlinedIcon />
                            <a
                              onClick={() =>
                                handleVOIPJoin(
                                  channel.ChannelID,
                                  channel.ChannelName
                                )
                              }
                            >
                              {channel.ChannelName}
                            </a>
                            {isAdmin && (
                              <PersonAddOutlinedIcon
                                id="manage-members-icon"
                                onClick={() =>
                                  handleOpenManageChannelsModal(
                                    channel.ChannelID
                                  )
                                }
                              />
                            )}
                          </div>
                        ) : null}
                        {/* manage channel modal */}
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
            <Outlet context={members} />
          </div>
        </section>
      )}
    </>
  );
};

//Export the User groups component
export default Groups;
