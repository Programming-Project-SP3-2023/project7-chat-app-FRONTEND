/**
 * Dashboard Main Menu component
 */

import DashboardMainColumn from "../partial/DashboardMainColumn"
/**
 * Builds and renders the Dashboard main menu component
 * @returns Dashboard Main Menu component render
 */

const DashboardMain = () => {
  return (
    <article className="dashboard-main-menu">
      <DashboardMainColumn title="Online Friends" />
      <DashboardMainColumn title="People Currently in voice" />
      <DashboardMainColumn title="Quick Actions" />
    </article>
  );
};

//Export the Dashboard Main component
export default DashboardMain;