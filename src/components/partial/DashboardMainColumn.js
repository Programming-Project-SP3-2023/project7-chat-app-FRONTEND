/**
 * Dashboard Main Column component
 */

/**
 * Builds and renders the Dashboard Main Column component
 * @returns Dashboard Main Column component render
 */

const DashboardMainColumn = ({title}) => {
  return (
    <div className="dashboard-main-column">
      <div className="column-header">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

//Export the Dashboard Main Column component
export default DashboardMainColumn;
