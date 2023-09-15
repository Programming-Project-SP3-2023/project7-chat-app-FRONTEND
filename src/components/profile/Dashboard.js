/**
 * Dashboard component
 */

import { Link } from "@mui/material";
import { Outlet } from "react-router-dom";
import { getUser, resetUserSession } from "../../utils/localStorage";
import SideMenu from "../partial/SideMenu";
import { useState } from "react";

/**
 * Builds and renders the dashboard component
 * @returns Dashboard component render
 */
const Dashboard = () => {
  // temporary user for development
  const user = getUser();
  const mainOptions = ["Dashboard", "Friends"];
  const groups = ["Group 1", "Group 2", "Another Group"];
  const options = mainOptions.concat(groups);
  const [selectedOpt, setSelectedOpt] = useState(0);

  /**
   * Log user out
   */
  const logout = () => {
    //Delete data from local storage
    resetUserSession();
  };

  return (
    <section className="main-section" id="dashboard">
      <SideMenu options={options} setSelectedOpt={setSelectedOpt} selectedOpt={selectedOpt} />
      <div className="dashboard-main">
        <h1>Dashboard page</h1>
        <h3>Temporary user testing display:</h3>
        <p>EMAIL: {user && user.email}</p>
        <p>PASSWORD: {user && user.password}</p>
        <h1> SELECTED OPTION IS {options[selectedOpt]}</h1>
        <Link href="/" onClick={logout}>
          Logout
        </Link>
        <Outlet />
      </div>
    </section>
  );
};

//Export the profile component
export default Dashboard;
