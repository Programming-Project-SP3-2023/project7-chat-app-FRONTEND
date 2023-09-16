/**
 * Dashboard component
 */

import { Box, Link } from "@mui/material";
import { Outlet } from "react-router-dom";
import { getUser, resetUserSession } from "../../utils/localStorage";
import SideMenu from "../partial/SideMenu";
import { useState } from "react";

// for testing
import ChatUI from "../DM/ChatUI";
import Friends from "../profile/Friends";

import Grid from "@mui/material/Grid";

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
      <SideMenu
        options={options}
        setSelectedOpt={setSelectedOpt}
        selectedOpt={selectedOpt}
      />

      <div className="dashboard-main">
        <h1>Dashboard page</h1>
        <h3>Temporary user testing display:</h3>
        <p>EMAIL: {user && user.email}</p>
        <p>PASSWORD: {user && user.password}</p>
        <Link href="/" onClick={logout}>
          Logout
        </Link>
        <Outlet />

        {/* Testing */}
        <Box sx={{ height: 600, flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Friends />
            </Grid>
            <Grid item xs={9}>
              <ChatUI />
            </Grid>
          </Grid>
        </Box>
      </div>
    </section>
  );
};

//Export the profile component
export default Dashboard;
