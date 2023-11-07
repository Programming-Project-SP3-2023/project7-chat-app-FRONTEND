/**
 * Admin Users component
 */

import { useEffect } from "react";

/**
 * Builds and renders the Admin Users component
 * @returns Admin Users component render
 */
const AdminUsers = ({setAdminTitle}) => {

  useEffect(() => {
    setAdminTitle("Manage Users");
  },[])

  return (
    <>
    </>
  );
};

//Export the Users component
export default AdminUsers;
