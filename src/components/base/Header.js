/**
 * Header component
 */

import { useEffect, useState } from "react";
import ECHO_LOGO from "../../assets/echo_transparent.png";
import { Link } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

/**
 * Builds and renders the header component
 * @returns Header component render
 */
const Header = ({ isLoggedIn }) => {
  const [headerId, setHeaderId] = useState("header");

  // dropdown menu functions
  const openDropdown = () => {
    console.log("open dropdown");
  }

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
      {headerId === "header-dark" && <MenuIcon id="dropdown-menu-icon" onClick={openDropdown}/>}
    </header>
  );
};

//Export the header component
export default Header;
