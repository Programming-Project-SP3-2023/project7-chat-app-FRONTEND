/**
 * Dashboard Main Menu component
 */

import DashboardMainColumn from "../partial/DashboardMainColumn";
import ManageFriendsModal from "../partial/ManageFriendsModal";
import AddGroup from "./AddGroup";
import { useState, useEffect } from "react";
import {
  getUsers,
  getFriends,
  getFriendRequests,
} from "../../services/friendsAPI";
/**
 * Builds and renders the Dashboard main menu component
 * @returns Dashboard Main Menu component render
 */

const DashboardMain = () => {
  // state handler for create group modal
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  // state handler for manage friends modal
  const [manageFriendsModalOpen, setManageFriendsModalOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const [loading, setLoading] = useState(false);

  // Fetch all users, friends and friend requests
  useEffect(() => {
    // 1. set fetching state to true for page to be on hold (loading)
    setLoading(true);

    // 2. define fetch users function
    async function fetchUsers() {
      const response = await getUsers("");
      console.log("USERS: ", response[0]);
      setUsers(response[0]);
    }

    // 3. define fetch friends function
    async function fetchFriends() {
      const response = await getFriends();
      console.log("FRIENDS: ", response);
      setFriends(response);
    }

    // 4. define fetch friends requests function
    async function fetchFriendRequests() {
      const response = await getFriendRequests();
      console.log("REQUESTS: ", response);

      setFriendRequests(response);
    }

    // 5. Call functions
    async function runFetch() {
      await fetchUsers();
      await fetchFriends();
      await fetchFriendRequests();
      // once fetched, set fetching state to false
      setLoading(false);
    }

    runFetch();
  }, []);

  return (
    <>
      {loading ? (
        <div id="loading-screen">
          <h2>Loading user data...</h2>
        </div>
      ) : (
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
            friends={friends}
            friendRequests={friendRequests}
          />
          <article className="dashboard-main-menu">
            <DashboardMainColumn title="My Friends" friends={friends} />
            <DashboardMainColumn title="Online Friends" friends={friends} />
            <DashboardMainColumn
              title="Quick Actions"
              groupModalOpen={groupModalOpen}
              setGroupModalOpen={setGroupModalOpen}
              manageFriendsModalOpen={manageFriendsModalOpen}
              setManageFriendsModalOpen={setManageFriendsModalOpen}
            />
          </article>
        </>
      )}
    </>
  );
};

//Export the Dashboard Main component
export default DashboardMain;
