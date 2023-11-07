/**
 * Admin Groups component
 */

import { useEffect } from "react";

/**
 * Builds and renders the Admin Groups component
 * @returns Admin Groups component render
 */
const AdminGroups = ({setAdminTitle}) => {

  useEffect(() => {
    setAdminTitle("Manage Groups");
  },[])

  return (
    <>
    </>
  );
};

//Export the Admin Groups component
export default AdminGroups;
