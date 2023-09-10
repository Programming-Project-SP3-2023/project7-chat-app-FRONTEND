/**
 * Header component
 */

import ECHO_LOGO from "../../assets/echo_logo.png";
import { Link } from "@mui/material";

/**
 * Builds and renders the header component
 * @returns Header component render
 */
const Header = () => {
  return (
    <header id="header">
      <div id="logo-container">
        <Link href="/">
        <img src={ECHO_LOGO} alt="Echo - a professional chat tool" />
        </Link>
      </div>
    </header>
  );
};

//Export the header component
export default Header;
