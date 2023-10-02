/**
 * Dashboard component
 */

// import { Outlet } from "react-router-dom";
import { getUser, resetUserSession } from "../../utils/localStorage";
import SideMenu from "../partial/SideMenu";
import { useState } from "react";
import { Link } from "react-router-dom";

import ChatUI from "../DM/ChatUI";
import Friends from "../profile/Friends";
import DashboardMain from "./DashboardMain";
import AddGroup from "./AddGroup";
import ManageFriendsModal from "../partial/ManageFriendsModal";

/**
 * Builds and renders the dashboard component
 * @returns Dashboard component render
 */
const Dashboard = ({socket}) => {
  // temporary user for development
  const user = getUser();
  // separating first two options from groups as in future development
  // the groups will be pulled from a backend endpoint
  const mainOptions = ["Dashboard", "Friends"];
  const groups = ["Group 1", "Group 2"];
  const options = mainOptions.concat(groups);
  options.push("Add Group");
  // state variables
  const [selectedOpt, setSelectedOpt] = useState(0);
  // state handler for create group modal
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  // state handler for manage friends modal
  const [manageFriendsModalOpen, setManageFriendsModalOpen] = useState(false);

  /**
   * Log user out
   */
  const logout = () => {
    //Delete data from local storage
    resetUserSession();
  };

  return (
    <section className="main-section" id="dashboard">
      {/* Add group modal */}
      <AddGroup
        groupModalOpen={groupModalOpen}
        setGroupModalOpen={setGroupModalOpen}
      />
      {/* Manage Friends Modal */}
      <ManageFriendsModal
        manageFriendsModalOpen={manageFriendsModalOpen}
        setManageFriendsModalOpen={setManageFriendsModalOpen}
      />
      <div id="dashboard-header-title">
        <h2>{options[selectedOpt]}</h2>
      </div>
      {/* Side menu rendering */}
      <SideMenu
        options={options}
        setSelectedOpt={setSelectedOpt}
        selectedOpt={selectedOpt}
        groupModalOpen={groupModalOpen}
        setGroupModalOpen={setGroupModalOpen}
        socket={socket}
      />
      <div className="dashboard-main">
        {/* Conditional rendering changing depending on selected option */}
        {selectedOpt === 0 && (
          <DashboardMain
            groupModalOpen={groupModalOpen}
            setGroupModalOpen={setGroupModalOpen}
            manageFriendsModalOpen={manageFriendsModalOpen}
            setManageFriendsModalOpen={setManageFriendsModalOpen}
          />
        )}
        {selectedOpt === 1 && (
          <Friends
            manageFriendsModalOpen={manageFriendsModalOpen}
            setManageFriendsModalOpen={setManageFriendsModalOpen}
          />
        )}
        {selectedOpt === options.length - 1 && <AddGroup />}
        {selectedOpt > 1 && selectedOpt < options.length - 1 && <ChatUI socket={socket} />}
        <Link href="/" onClick={logout}>
          Logout
        </Link>
        {/* <Outlet /> */}
      </div>
    </section>
  );
};

//Export the profile component
export default Dashboard;
