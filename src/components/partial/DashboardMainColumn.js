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
}) => {
  // const friends = [
  //   { name: "Jack Sparrow", img: "something/src.jpg" },
  //   { name: "Coco Wood", img: "something/src.jpg" },
  //   { name: "Juliette Barton", img: "something/src.jpg" },
  //   { name: "Mark Ruffalo", img: "something/src.jpg" },
  // ];

  const [onlineFriends, setOnlineFriends] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    socket.emit("getOnlineFriends");

    socket.on("onlineFriends", (friends) => {
      setOnlineFriends(friends);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

  const openEditProfileModal = () => {
    setEditProfileModalOpen(true);
  };

  return (
    <div className="dashboard-main-column">
      <div className="column-header">
        <h3>{title}</h3>
      </div>
      <div className="column-options">
        {/* Online friends and People in voice rendering */}
        {title !== "Quick Actions" && (
          <>
            {/* can be changed back to friends */}
            {onlineFriends.map((friend, i) => {
              return <MenuItem key={i} friend={friend} />;
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
