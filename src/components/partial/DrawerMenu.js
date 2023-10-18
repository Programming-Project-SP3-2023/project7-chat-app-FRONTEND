/**
 * Drawer Menu component
 */

import GridViewIcon from "@mui/icons-material/GridView";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, Avatar } from "@mui/material";
import {
  resetTokenSession,
  resetUserID,
  resetUserSession,
  getUser,
} from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";


/**
 * Builds and renders the Drawer Menu component
 * @returns Drawer Menu component render
 */

const DrawerMenu = ({ setOpenDrawer, setRefresh }) => {
  // instantiate navigation prop
  const navigate = useNavigate();

  const currentUser = getUser();

  // logout function
  const logout = async () => {
    await setOpenDrawer(false);
    await resetUserSession();
    await resetTokenSession();
    await resetUserID();
    await setRefresh(true);
    navigate("/");
  };

  return (
    <Box
      role="presentation"
      onClick={() => setOpenDrawer(false)}
      onKeyDown={() => setOpenDrawer(false)}
      sx={{ height: "100%" }}
    >
      <div className="settings-header">
        {/* Should be user.name but we don't yet have a complete one at login */}
        <h2>{currentUser && currentUser.displayName}</h2>
        {currentUser.image ? (
          <Avatar src={currentUser.image} id="profile-avatar" />
        ) : (
          <Avatar id="profile-avatar" />
        )}
      </div>
      <div className="settings-options">
        <div className="settings-option" onClick={() => navigate("/dashboard")}>
          <GridViewIcon />
          <h3>Dashboard</h3>
        </div>
        <div className="settings-option">
          <SettingsOutlinedIcon />
          <h3>Account Settings</h3>
        </div>
        <div className="settings-option">
          <LockOutlinedIcon />
          <h3>Change Password</h3>
        </div>
      </div>
      <div className="settings-footer">
        <LogoutIcon onClick={logout} />
      </div>
    </Box>
  );
};

//Export the Drawer Menu component
export default DrawerMenu;
