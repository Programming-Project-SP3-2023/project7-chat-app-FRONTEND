/**
 * Channels component
 */

import { Outlet } from "react-router-dom";

/**
 * Builds and renders the channels component
 * @returns Channels component render
 */
const Channels = () => {
  return (
    <section className="main-section">
      <h1>Channels page</h1>
      <Outlet />
    </section>
  );
};

//Export the channels component
export default Channels;
