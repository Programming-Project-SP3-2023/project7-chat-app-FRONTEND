/**
 * Dashboard Main Menu component
 */

import DashboardMainColumn from "../partial/DashboardMainColumn";
import ManageFriendsModal from "../friends/ManageFriendsModal";
import AddFriendConfirmation from "../friends/AddFriendConfirmation";
import AddGroup from "../groups/AddGroup";
import { useState, useEffect } from "react";
import { getUserByID, getAvatarByID } from "../../services/userAPI";
import { getFriends, getFriendRequests } from "../../services/friendsAPI";
import {
  getAccessToken,
  getUserID,
  setUserSession,
} from "../../utils/localStorage";

import { CircularProgress } from "@mui/material";
import { getAccounts } from "../../services/adminAPI";

/**
 * Builds and renders the Dashboard main menu component
 * @returns Dashboard Main Menu component render
 */

const DashboardMain = ({
  groupReload,
  setGroupReload,
  editProfileModalOpen,
  setEditProfileModalOpen,
}) => {
  // state handler for create group modal
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  // state handler for manage friends modal
  const [manageFriendsModalOpen, setManageFriendsModalOpen] = useState(false);
  // state handler for add friend confirmation modal
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isAdd, setIsAdd] = useState(true);
  const [friendToAdd, setFriendToAdd] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);

  const [loading, setLoading] = useState(false);

  // trigger refresh flag
  const [refresh, setRefresh] = useState(false);

  const userID = getUserID();
  const accessToken = getAccessToken();

  // Fetch user, all users, friends and friend requests
  useEffect(() => {
    // 1. set fetching state to true for page to be on hold (loading)
    setLoading(true);

    // 2. define fetch users function
    async function fetchUsers() {
      const response = await getAccounts();
      setUsers(response);
    }

    // 3. define fetch friends function
    async function fetchFriends() {
      const response = await getFriends();
      setFriends(response);
    }

    // 4. define fetch friends requests function
    async function fetchFriendRequests() {
      setLoading(true);
      const response = await getFriendRequests();

      setFriendRequests(response);
    }

    // 5. fetch user details and send to local storage
    async function fetchUser() {
      const response = await getUserByID(userID, accessToken);
      const avatarResponse = await getAvatarByID(userID, accessToken);

      let user;
      if (response && avatarResponse) {
        user = {
          email: response.email,
          displayName: response.displayName,
          dob: response.dob,
          username: response.username,
          image: avatarResponse.avatarData,
        };
      } else if (response && !avatarResponse) {
        user = {
          email: response.email,
          displayName: response.displayName,
          dob: response.dob,
          username: response.username,
        };
      }
      setUserSession(user);
    }

    // 5. Call functions
    async function runFetch() {
      await fetchUsers();
      await fetchFriends();
      await fetchFriendRequests();
      await fetchUser();
      // once fetched, set fetching state to false
      setLoading(false);
      setRefresh(false);
    }

    runFetch();
  }, [refresh]);

  return (
    <>
      {loading ? (
        <div id="loading-screen">
          <CircularProgress size={100} />
        </div>
      ) : (
        <>
          {/* Add group modal */}
          <AddGroup
            groupModalOpen={groupModalOpen}
            setGroupModalOpen={setGroupModalOpen}
            friends={friends}
            groupReload={groupReload}
            setGroupReload={setGroupReload}
          />
          {/* Manage Friends Modal */}
          <ManageFriendsModal
            manageFriendsModalOpen={manageFriendsModalOpen}
            setManageFriendsModalOpen={setManageFriendsModalOpen}
            users={users}
            friends={friends}
            friendRequests={friendRequests}
            setRefresh={setRefresh}
            setFriendToAdd={setFriendToAdd}
            setAddFriendModalOpen={setAddFriendModalOpen}
            setIsAdd={setIsAdd}
          />
          {/* Add friends confirmation modal */}
          <AddFriendConfirmation
            addFriendModalOpen={addFriendModalOpen}
            setAddFriendModalOpen={setAddFriendModalOpen}
            friend={friendToAdd}
            isAdd={isAdd}
            setRefresh={setRefresh}
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
              editProfileModalOpen={editProfileModalOpen}
              setEditProfileModalOpen={setEditProfileModalOpen}
            />
          </article>
        </>
      )}
    </>
  );
};

//Export the Dashboard Main component
export default DashboardMain;
