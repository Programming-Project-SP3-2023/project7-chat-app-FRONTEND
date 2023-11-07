/**
 * Admin Home component
 */

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useEffect } from "react";
import { useNavigate } from "react-router";

/**
 * Builds and renders the Admin Home component
 * @returns Admin Home component render
 */
const AdminHome = ({setAdminTitle}) => {

  useEffect(() => {
    setAdminTitle("Admin Page");
  },[])

  const navigate = useNavigate();

  return (
<>    
      <div className="admin-home-partial" onClick={() => navigate('users')}>
        <PersonOutlinedIcon />
        <h2>Manage Users</h2>
      </div>
      <div className="admin-home-partial" onClick={() => navigate('groups')}>
        <PeopleAltOutlinedIcon />
        <h2>Manage Groups</h2>
      </div>
    </>
  );
};

//Export the homepage component
export default AdminHome;
