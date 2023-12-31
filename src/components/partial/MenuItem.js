/**
 * Dashboard Menu Item component
 */

import { Avatar } from "@mui/material";

/**
 * Builds and renders the Dashboard Menu Item component
 * @returns Dashboard Menu Item component render
 */

const MenuItem = ({friend}) => {

  // TODO - friend profile pic for Avatar component should come from the friend object (API call)

  return <div className="dashboard-menu-item">
    <Avatar className="menu-item-avatar" alt="Sample profile" src={friend.Avatar} />
    <span>{friend.DisplayName}</span>
  </div>;
};

//Export the Dashboard Menu Item component
export default MenuItem;
