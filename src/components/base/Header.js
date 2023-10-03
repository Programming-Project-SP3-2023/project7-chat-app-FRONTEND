/**
 * Header component
 */

import { useEffect, useState } from "react";
import ECHO_LOGO from "../../assets/echo_transparent.png";

import MenuIcon from "@mui/icons-material/Menu";
import { Drawer, Link } from "@mui/material";
import DrawerMenu from "../partial/DrawerMenu";
import { getUser } from "../../utils/localStorage";

/**
 * Builds and renders the header component
 * @returns Header component render
 */
const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [headerId, setHeaderId] = useState("header");
  const [openDrawer, setOpenDrawer] = useState(false);
  // fetch logged in user
  const user = getUser();

  // dropdown menu functions
  const openDrawerMenu = () => {
    console.log("open dropdown");
    setOpenDrawer(true);
  };

  useEffect(() => {
    setHeaderId(isLoggedIn ? "header-dark" : "header");
  }, [isLoggedIn]);

  return (
    <header id={headerId}>
      <div id="logo-container">
        <Link href="/">
          <img src={ECHO_LOGO} alt="Echo - a professional chat tool" />
        </Link>
      </div>
      {headerId === "header-dark" && (
        <MenuIcon id="dropdown-menu-icon" onClick={openDrawerMenu} />
      )}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        {<DrawerMenu setOpenDrawer={setOpenDrawer} user={user} setIsLoggedIn={setIsLoggedIn} />}
      </Drawer>
    </header>
  );
};

//Export the header component
export default Header;
