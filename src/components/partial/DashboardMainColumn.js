/**
 * Dashboard Main Column component
 */

import MenuItem from "./MenuItem";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

/**
 * Builds and renders the Dashboard Main Column component
 * @returns Dashboard Main Column component render
 */

const DashboardMainColumn = ({ title }) => {
  const friends = [
    { name: "Jack Sparrow", img: "something/src.jpg" },
    { name: "Coco Wood", img: "something/src.jpg" },
    { name: "Juliette Barton", img: "something/src.jpg" },
    { name: "Mark Ruffalo", img: "something/src.jpg" },
  ];

  return (
    <div className="dashboard-main-column">
      <div className="column-header">
        <h3>{title}</h3>
      </div>
      <div className="column-options">
        {/* Online friends and People in voice rendering */}
        {title !== "Quick Actions" && (
          <>
            {friends.map((friend, i) => {
              return <MenuItem key={i} friend={friend} />;
            })}
          </>
        )}
        {/* Quick actions rendering */}
        {title === "Quick Actions" && (
          <>
            <div className="dashboard-menu-item">
              <div className="menu-item-icon-wrapper">
                <AddCircleOutlineIcon />
              </div>
              <span>Create a new Group</span>
            </div>
            <div className="dashboard-menu-item">
              <div className="menu-item-icon-wrapper">
                <PersonAddOutlinedIcon />
              </div>
              <span>Add Friend</span>
            </div>
            <div className="dashboard-menu-item">
              <div className="menu-item-icon-wrapper">
                <SettingsOutlinedIcon />
              </div>
              <span>Edit Profile</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

//Export the Dashboard Main Column component
export default DashboardMainColumn;
