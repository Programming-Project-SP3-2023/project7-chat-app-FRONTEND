/**
 * Dashboard component
 */

import { Outlet } from "react-router-dom";
import { getSideMenuOption, setSideMenuOption } from "../../utils/localStorage";
import SideMenu from "../partial/SideMenu";
import { useEffect, useState } from "react";
import AddGroup from "./AddGroup";

/**
 * Builds and renders the dashboard component
 * @returns Dashboard component render
 */
const Dashboard = () => {
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

  // make selected options persistent so it stays in the browser after refresh
  const handleSelectOption = (selected) => {
    setSideMenuOption(selected);
    setSelectedOpt(selected);
  };

  // fetch selected option
  useEffect(() => {
    const selected = getSideMenuOption();
    if (selected) setSelectedOpt(selected);
  }, [selectedOpt]);

  return (
    <section className="main-section" id="dashboard">
      {/* Add group modal */}
      <AddGroup
        groupModalOpen={groupModalOpen}
        setGroupModalOpen={setGroupModalOpen}
      />
      <div id="dashboard-header-title">
        <h2>{options[selectedOpt]}</h2>
      </div>
      {/* Side menu rendering */}
      <SideMenu
        options={options}
        handleSelectOption={handleSelectOption}
        selectedOpt={selectedOpt}
        groupModalOpen={groupModalOpen}
        setGroupModalOpen={setGroupModalOpen}
      />
      <div className="dashboard-main">
        {/* Conditional rendering changing depending on selected option */}
        {selectedOpt === options.length - 1 && <AddGroup />}
        <Outlet />
      </div>
    </section>
  );
};

//Export the profile component
export default Dashboard;
