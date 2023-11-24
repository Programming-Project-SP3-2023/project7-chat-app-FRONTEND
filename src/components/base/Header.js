/**
 * Header component
 */

import { useEffect, useState } from "react";
import ECHO_LOGO from "../../assets/echo_transparent.png";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { Drawer, Link } from "@mui/material";
import DrawerMenu from "../partial/DrawerMenu";
import { getUser, resetAdminID, resetTokenSession } from "../../utils/localStorage";
import { useNavigate } from "react-router";

/**
 * Builds and renders the header component
 * @returns Header component render
 */
const Header = ({
  adminIsLoggedIn,
  setAdminIsLoggedIn,
  isLoggedIn,
  refresh,
  setRefresh,
  pwdUpdateOpen,
  setPwdUpdateOpen,
  editProfileModalOpen,
  setEditProfileModalOpen,
  sideRefresh,
  setSideRefresh
}) => {
  const [headerId, setHeaderId] = useState("header");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  // fetch logged in user
  const user = getUser();

  //instantiate use navigate
  const navigate = useNavigate();

  // dropdown menu functions
  const openDrawerMenu = () => {
    setOpenDrawer(true);
  };

  const adminLogout = () => {
    setAdminIsLoggedIn(false);
    resetAdminID();
    resetTokenSession();
    navigate("/admin");
  };

  useEffect(() => {
    // 1. if the user is logged in or not
    setHeaderId(isLoggedIn || adminIsLoggedIn ? "header-dark" : "header");

    // 1. check if the pathway is admin
    const URI = window.location.pathname.split("/")[1];
    if (URI === "admin" || URI === "admin-home") {
      setIsAdmin(true);
    }
  }, [adminIsLoggedIn, isLoggedIn, refresh]);

  return (
    <header id={headerId}>
      <div id="logo-container">
        <Link href={!isAdmin ? "/" : "/admin/users"}>
          <img src={ECHO_LOGO} alt="Echo - a professional chat tool" />
        </Link>
      </div>
      {isLoggedIn && (
        <MenuIcon id="dropdown-menu-icon" onClick={openDrawerMenu} />
      )}
      {adminIsLoggedIn && (
        <LogoutIcon id="dropdown-menu-icon" onClick={adminLogout} />
      )}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        {
          <DrawerMenu
            setOpenDrawer={setOpenDrawer}
            user={user}
            refresh={refresh}
            setRefresh={setRefresh}
            setPwdUpdateOpen={setPwdUpdateOpen}
            setEditProfileModalOpen={setEditProfileModalOpen}
            sideRefresh={sideRefresh}
            setSideRefresh={setSideRefresh}
          />
        }
      </Drawer>
    </header>
  );
};

//Export the header component
export default Header;
