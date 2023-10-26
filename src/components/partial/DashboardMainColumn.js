/**
 * Dashboard Main Column component
 */

import MenuItem from "./MenuItem";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useState, useEffect } from "react";

import { useSocket } from "../../services/SocketContext";

import EditProfile from "../profile/EditProfile";

/**
 * Builds and renders the Dashboard Main Column component
 * @returns Dashboard Main Column component render
 */

const DashboardMainColumn = ({
  title,
  setGroupModalOpen,
  setManageFriendsModalOpen,
  friends,
}) => {
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  // method for checking online friends
  const { socket } = useSocket();
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    //open listener for online friends
    socket.on("onlineFriends", (data) => {
      setOnlineFriends(data);
    });
    // ask for data
    socket.emit("getOnlineFriends");

    return () => {
      socket.off("getOnlineFriends");
    };
  }, [socket]);

  useEffect(() => {});

  const openEditProfileModal = () => {
    setEditProfileModalOpen(true);
  };

  return (
    <div className="dashboard-main-column">
      <div className="column-header">
        <h3>{title}</h3>
      </div>
      <div className="column-options">
        {/* My friends rendering */}
        {title === "My Friends" && (
          <>
            {friends &&
              friends.map((friend, i) => {
                return <MenuItem key={i} friend={friend} />;
              })}
          </>
        )}
        {/* Online friends rendering */}
        {title === "Online Friends" && (
          <>
            {friends &&
              friends.map((friend, i) => {
                //searching through onlineFriends account ID and displays if found
                if (onlineFriends.includes(friend.AccountID)) {
                  return <MenuItem key={i} friend={friend} />;
                }
                return null;
              })}
          </>
        )}
        {/* Quick actions rendering */}
        {title === "Quick Actions" && (
          <>
            <div
              className="dashboard-menu-item"
              onClick={() => setGroupModalOpen(true)}
            >
              <div className="menu-item-icon-wrapper">
                <AddCircleOutlineIcon />
              </div>
              <span>Create a new Group</span>
            </div>
            <div
              className="dashboard-menu-item"
              onClick={() => setManageFriendsModalOpen(true)}
            >
              <div className="menu-item-icon-wrapper">
                <PeopleAltOutlinedIcon />
              </div>
              <span>Manage Friends</span>
            </div>
            <div className="dashboard-menu-item" onClick={openEditProfileModal}>
              <div className="menu-item-icon-wrapper">
                <SettingsOutlinedIcon />
              </div>
              <span>Edit Profile </span>
            </div>
          </>
        )}
      </div>
      {/* EditProfile Modal */}
      <EditProfile
        editProfileModalOpen={editProfileModalOpen}
        setEditProfileModalOpen={setEditProfileModalOpen}
      />
    </div>
  );
};

//Export the Dashboard Main Column component
export default DashboardMainColumn;
