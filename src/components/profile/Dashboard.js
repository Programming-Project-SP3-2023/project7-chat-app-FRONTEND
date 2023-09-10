/**
 * Dashboard component
 */

import { Link } from "@mui/material";
import { Outlet } from "react-router-dom";
import { getUser, resetUserSession } from "../../utils/localStorage";

/**
 * Builds and renders the dashboard component
 * @returns Dashboard component render
 */
const Dashboard = () => {
  // temporary user for development
  const user = getUser();

  /**
   * Log user out
   */
  const logout = () => {
    //Delete data from local storage
    resetUserSession();
  };

  return (
    <section className="main-section">
      <h1>Dashboard page</h1>
      <h3>Temporary user testing display:</h3>
      <p>EMAIL: {user && user.email}</p>
      <p>PASSWORD: {user && user.password}</p>
      <Link href="/" onClick={logout}>
        Logout
      </Link>
      <Outlet />
    </section>
  );
};

//Export the profile component
export default Dashboard;
