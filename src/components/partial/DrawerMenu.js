/**
 * Drawer Menu component
 */

import GridViewIcon from "@mui/icons-material/GridView";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, Avatar } from "@mui/material";
import { resetTokenSession, resetUserSession } from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";

/**
 * Builds and renders the Drawer Menu component
 * @returns Drawer Menu component render
 */

const DrawerMenu = ({ setOpenDrawer, user, setRefresh }) => {
  // instantiate navigation prop
  const navigate = useNavigate();

  // logout function
  const logout = async () => {
    await setOpenDrawer(false);
    await resetUserSession();
    await resetTokenSession();
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
        <h2>{user && user.email}</h2>
        <Avatar id="profile-avatar" />
      </div>
      <div className="settings-options">
        <div className="settings-option">
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
