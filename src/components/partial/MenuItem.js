/**
 * Dashboard Menu Item component
 */

import { Avatar } from "@mui/material";
// PICS FOR TESTING **
// import SAMPLE_PIC_1 from "../../assets/sample-pic.jpeg";
import SAMPLE_PIC_2 from "../../assets/sample-pic-2.jpeg";

/**
 * Builds and renders the Dashboard Menu Item component
 * @returns Dashboard Menu Item component render
 */

const MenuItem = () => {
  return <div className="dashboard-menu-item">
    <Avatar className="menu-item-avatar" alt="Sample profile" src={SAMPLE_PIC_2} />
    <span>Sample text</span>
  </div>;
};

//Export the Dashboard Menu Item component
export default MenuItem;
