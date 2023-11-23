/**
 * Dashboard component
 */

import { Outlet } from "react-router-dom";
import {
  getSideMenuOption,
  setGroupsSession,
  setSideMenuOption,
} from "../../utils/localStorage";
import SideMenu from "../partial/SideMenu";
import { useEffect, useState } from "react";
import AddGroup from "../groups/AddGroup";
import { getFriends } from "../../services/friendsAPI";
import { getGroupByID, getGroupIDs } from "../../services/groupsAPI";
import PasswordUpdateModal from "../profile/PasswordUpdate";
import EditProfile from "../profile/EditProfile";

/**
 * Builds and renders the dashboard component
 * @returns Dashboard component render
 */
const Dashboard = ({
  setRefresh,
  refresh,
  headerTitle,
  setHeaderTitle,
  accessTokenFast,
  groupReload,
  setGroupReload,
  pwdUpdateOpen,
  setPwdUpdateOpen,
  editProfileModalOpen,
  setEditProfileModalOpen,
  sideRefresh
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedOpt, setSelectedOpt] = useState(0);
  const [friends, setFriends] = useState([]);
  const [options, setOptions] = useState([]);
  const [groups, setGroups] = useState([]);
  const mainOptions = ["Dashboard", "Friends"];
  // state handler for create group modal
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  // Fetch friends
  useEffect(() => {
    // 1. define fetch friends function
    async function fetchFriends() {
      try {
        const response = await getFriends();
        console.log("FRIENDS: ", response);
        setFriends(response);
      } catch (err) {
        console.log(err);
        setFriends([]);
      }
    }

    // 2. define fetch groups function
    async function fetchGroups() {
      try {
        const response = await getGroupIDs(accessTokenFast);
        console.log("MY GROUP IDs: ", response);
        return response;
      } catch (err) {
        console.log(err);
      }
    }

    // 3. Get group info for each id
    async function fetchGroupsInfo(groupIDs) {
      const tempGroups = [];
      try {
        for (let i = 0; i < groupIDs.length; i++) {
          const groupRes = await getGroupByID(groupIDs[i], accessTokenFast);
          mainOptions.push(groupRes.groupName);
          tempGroups.push(groupRes);
        }
        setGroups(tempGroups);
        setGroupsSession(tempGroups);
      } catch (err) {
        console.log(err);
      }
    }

    // 5. call fetch functions
    async function fetchData() {
      setLoading(true);
      await fetchFriends();
      const groupIDs = await fetchGroups();
      await fetchGroupsInfo(groupIDs);

      console.log(groupIDs);
      console.log(groups);
      mainOptions.push("Add Group");
      setOptions(mainOptions);
      console.log("OPTIONS", mainOptions);
      setLoading(false);
    }

    fetchData();
  }, [groupReload]);

  // make selected options persistent so it stays in the browser after refresh
  const handleSelectOption = (selected) => {
    setSideMenuOption(selected);
    setSelectedOpt(selected);
    setRefresh(!refresh);
    setHeaderTitle(options[selected]);
  };

  // fetch selected option
  useEffect(() => {
    const selected = getSideMenuOption();
    if (selected) setSelectedOpt(selected);
    handleSelectOption(selected);
  }, [selectedOpt, groupReload, sideRefresh]);

  return (
    <section className="main-section" id="dashboard">
      {!loading && (
        <>
          <AddGroup
            groupModalOpen={groupModalOpen}
            setGroupModalOpen={setGroupModalOpen}
            friends={friends}
            groupReload={groupReload}
            setGroupReload={setGroupReload}
          />
          <PasswordUpdateModal
            pwdUpdateOpen={pwdUpdateOpen}
            setPwdUpdateOpen={setPwdUpdateOpen}
          />
          <EditProfile
            editProfileModalOpen={editProfileModalOpen}
            setEditProfileModalOpen={setEditProfileModalOpen}
          />
        </>
      )}

      <div id="dashboard-header-title">
        <h1>{headerTitle}</h1>
      </div>
      {/* Side menu rendering */}
      {!loading && (
        <SideMenu
          options={options}
          handleSelectOption={handleSelectOption}
          selectedOpt={selectedOpt}
          groupModalOpen={groupModalOpen}
          setGroupModalOpen={setGroupModalOpen}
          groups={groups}
        />
      )}

      <div className="dashboard-main">
        {/* Conditional rendering changing depending on selected option */}
        {selectedOpt === options.length - 1 && <AddGroup />}
        <Outlet />
      </div>
    </section>
  );
};

//Export the profile component
export default Dashboard;
