/**
 * Admin base component
 */

import { Outlet } from "react-router";

/**
 * Builds and renders the Admin base component
 * @returns Admin base component render
 */
const Admin = ({adminTitle}) => {

  return (
    <section className="main-section" id="admin-home">
      <h1 id="admin-title">{adminTitle}</h1>
      <Outlet />
    </section>
  );
};

//Export the Admin base component
export default Admin;
