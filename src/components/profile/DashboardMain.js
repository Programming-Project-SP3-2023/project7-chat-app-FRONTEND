/**
 * Dashboard Main Menu component
 */

import DashboardMainColumn from "../partial/DashboardMainColumn";
import ManageFriendsModal from "../partial/ManageFriendsModal";
import AddGroup from "./AddGroup";
import { useState } from "react";
/**
 * Builds and renders the Dashboard main menu component
 * @returns Dashboard Main Menu component render
 */

const DashboardMain = () => {
  // state handler for create group modal
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  // state handler for manage friends modal
  const [manageFriendsModalOpen, setManageFriendsModalOpen] = useState(false);

  return (
    <>
      {/* Add group modal */}
      <AddGroup
        groupModalOpen={groupModalOpen}
        setGroupModalOpen={setGroupModalOpen}
      />
      {/* Manage Friends Modal */}
      <ManageFriendsModal
        manageFriendsModalOpen={manageFriendsModalOpen}
        setManageFriendsModalOpen={setManageFriendsModalOpen}
      />
      <article className="dashboard-main-menu">
        <DashboardMainColumn title="Online Friends" />
        <DashboardMainColumn title="People Currently in voice" />
        <DashboardMainColumn
          title="Quick Actions"
          groupModalOpen={groupModalOpen}
          setGroupModalOpen={setGroupModalOpen}
          manageFriendsModalOpen={manageFriendsModalOpen}
          setManageFriendsModalOpen={setManageFriendsModalOpen}
        />
      </article>
    </>
  );
};

//Export the Dashboard Main component
export default DashboardMain;
