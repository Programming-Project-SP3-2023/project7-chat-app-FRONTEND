/**
 * Dashboard component
 */

import { Box } from "@mui/material";
// import { Outlet } from "react-router-dom";
import { getUser, resetUserSession } from "../../utils/localStorage";
import SideMenu from "../partial/SideMenu";
import { useState } from "react";

// for testing
import ChatUI from "../DM/ChatUI";
import Friends from "../profile/Friends";

import Grid from "@mui/material/Grid";
import DashboardMain from "./DashboardMain";
import AddGroup from "./AddGroup"

/**
 * Builds and renders the dashboard component
 * @returns Dashboard component render
 */
const Dashboard = () => {
  // temporary user for development
  const user = getUser();
  // separating first two options from groups as in future development
  // the groups will be pulled from a backend endpoint
  const mainOptions = ["Dashboard", "Friends"];
  const groups = ["Group 1", "Group 2", "Another Group"];
  const options = mainOptions.concat(groups);
  options.push("Add Group");
  // state variables
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
      <div id="dashboard-header-title">
        <h2>{options[selectedOpt]}</h2>
      </div>
      {/* Side menu rendering */}
      <SideMenu
        options={options}
        setSelectedOpt={setSelectedOpt}
        selectedOpt={selectedOpt}
      />
      <div className="dashboard-main">

        {/* Conditional rendering changing depending on selected option */}
        {selectedOpt === 0 && <DashboardMain />}
        {selectedOpt === 1 && <Friends />}
        {selectedOpt === options.length-1 && <AddGroup />}
        {selectedOpt > 1 && selectedOpt < options.length-1 && <ChatUI />}
        <Link href="/" onClick={logout}>
          Logout
        </Link>
        {/* <Outlet /> */}

        {/* Testing */}
        {/* <Box sx={{ height: 600, flexGrow: 1 }}>

          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Friends />
            </Grid>
            <Grid item xs={9}>
              <ChatUI />
            </Grid>
          </Grid>
        </Box> */}
      </div>
    </section>
  );
};

//Export the profile component
export default Dashboard;
