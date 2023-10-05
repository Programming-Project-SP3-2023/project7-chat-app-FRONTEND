/**
 * User groups component
 */

import { Outlet } from "react-router-dom";

/**
 * Builds and renders the User groups component
 * @returns User groups component render
 */
const Groups = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

//Export the User groups component
export default Groups;
