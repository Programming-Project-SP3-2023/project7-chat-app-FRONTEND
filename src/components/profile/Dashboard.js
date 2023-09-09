/**
 * Dashboard component
 */

import { Outlet } from "react-router-dom";

/**
 * Builds and renders the dashboard component
 * @returns Dashboard component render
 */
const Dashboard = () => {
  return (
    <section className="main-section">
      <h1>Dashboard page</h1>
      <Outlet />
    </section>
  );
};

//Export the profile component
export default Dashboard;
