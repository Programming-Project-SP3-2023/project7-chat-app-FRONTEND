/**
 * Admin Home component
 */

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useEffect } from "react";

/**
 * Builds and renders the Admin Home component
 * @returns Admin Home component render
 */
const AdminHome = ({setAdminTitle}) => {

  useEffect(() => {
    setAdminTitle("Admin Page");
  },[])

  return (
<>
      <div className="admin-home-partial">
        <PersonOutlinedIcon />
        <h2>Manage Users</h2>
      </div>
      <div className="admin-home-partial">
        <PeopleAltOutlinedIcon />
        <h2>Manage Groups</h2>
      </div>
    </>
  );
};

//Export the homepage component
export default AdminHome;
