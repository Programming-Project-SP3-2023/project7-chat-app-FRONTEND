/**
 * Admin Home component
 */

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

/**
 * Builds and renders the Admin Home component
 * @returns Admin Home component render
 */
const AdminHome = () => {
  return (
    <section className="main-section" id="admin-home">
        <h1 id="admin-title">Admin Page</h1>
        <div className="admin-home-partial">
            <PersonOutlinedIcon />
            <h2>Manage Users</h2>
        </div>
        <div className="admin-home-partial">
            <PeopleAltOutlinedIcon />
            <h2>Manage Groups</h2>
        </div>
    </section>
  );
};

//Export the homepage component
export default AdminHome;
