/**
 * React main component module
 */

// Dependencies
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Home from "./base/Home";
import Header from "./base/Header";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import EmailVerification from "./auth/EmailVerification";
import Dashboard from "./profile/Dashboard";
import Footer from "./base/Footer";
import NotFound from "./base/NotFound";
import Friends from "./friends/Friends";
import Groups from "./groups/Groups";
import Admin from "./admin/Admin";
import AdminLogin from "./admin/AdminLogin";
import AdminUsers from "./admin/AdminUsers";
import { getAdminID, getUser } from "../utils/localStorage";
import { useState, useEffect } from "react";
import DashboardMain from "./profile/DashboardMain";
import ChatUI from "./DM/ChatUI";
import GroupChatUI from "./DM/GroupChatUI";
import { useSocket } from "../services/SocketContext";
import VoiceChatRoom from "../components/voip/VOIPDisplay";

function App() {
  const user = getUser();
  const adminID = getAdminID();

  const [adminIsLoggedIn, setAdminIsLoggedIn] = useState(
    adminID ? true : false
  );
  const [isLoggedIn, setIsLoggedIn] = useState(user ? true : false);
  const [refresh, setRefresh] = useState(false);
  const [groupReload, setGroupReload] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("Echo");
  const [adminTitle, setAdminTitle] = useState("Echo - Admin");
  const [sideRefresh, setSideRefresh] = useState(false);

  // password update modal control
  const [pwdUpdateOpen, setPwdUpdateOpen] = useState(false);
  // edit profile modal control
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

  const [accessTokenFast, setAccessTokenFast] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    setIsLoggedIn(user ? true : false);
  }, [user, isLoggedIn, refresh]);

  return (
    <div className="App">
      <Header
        adminIsLoggedIn={adminIsLoggedIn}
        setAdminIsLoggedIn={setAdminIsLoggedIn}
        isLoggedIn={isLoggedIn}
        refresh={refresh}
        setRefresh={setRefresh}
        pwdUpdateOpen={pwdUpdateOpen}
        setPwdUpdateOpen={setPwdUpdateOpen}
        editProfileModalOpen={editProfileModalOpen}
        setEditProfileModalOpen={setEditProfileModalOpen}
        sideRefresh={sideRefresh}
        setSideRefresh={setSideRefresh}
      />
      <Routes>
        <Route
          path="/"
          element={!isLoggedIn ? <Home /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="login"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
              setAccessTokenFast={setAccessTokenFast}
            />
          }
        />
        <Route path="signup" element={<Signup />} />
        <Route
          path="verifyemail"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <EmailVerification />
          }
        />
        <Route
          path="dashboard"
          element={
            isLoggedIn ? (
              <Dashboard
                groupReload={groupReload}
                setGroupReload={setGroupReload}
                refresh={refresh}
                setRefresh={setRefresh}
                headerTitle={headerTitle}
                setHeaderTitle={setHeaderTitle}
                accessTokenFast={accessTokenFast}
                pwdUpdateOpen={pwdUpdateOpen}
                setPwdUpdateOpen={setPwdUpdateOpen}
                editProfileModalOpen={editProfileModalOpen}
                setEditProfileModalOpen={setEditProfileModalOpen}
                sideRefresh={sideRefresh}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route
            index
            element={
              <DashboardMain
                groupReload={groupReload}
                setGroupReload={setGroupReload}
                editProfileModalOpen={editProfileModalOpen}
                setEditProfileModalOpen={setEditProfileModalOpen}
              />
            }
          />
          <Route path="friends" element={<Friends socket={socket} />}>
            <Route path=":id" element={<ChatUI socket={socket} />} />
          </Route>
          <Route
            path="groups"
            element={
              <Groups
                setRefresh={setRefresh}
                refresh={refresh}
                groupReload={groupReload}
                setGroupReload={setGroupReload}
                setHeaderTitle={setHeaderTitle}
                socket={socket}
              />
            }
          >
            <Route path=":groupId" element={<GroupChatUI socket={socket} />}>
              <Route
                path=":channelId"
                element={<GroupChatUI socket={socket} />}
              />
            </Route>
            '
            <Route path=":groupId" element={<VoiceChatRoom socket={socket} />}>
              <Route path=":v" element={<VoiceChatRoom socket={socket} />}>
                <Route
                  path=":channelId"
                  element={<VoiceChatRoom socket={socket} />}
                />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="admin" element={<Admin adminTitle={adminTitle} />}>
          <Route
            index
            element={
              <AdminLogin
                setAdminIsLoggedIn={setAdminIsLoggedIn}
                adminIsLoggedIn={adminIsLoggedIn}
                setAdminTitle={setAdminTitle}
              />
            }
          />
          <Route
            path="users"
            element={
              adminIsLoggedIn ? (
                <AdminUsers setAdminTitle={setAdminTitle} />
              ) : (
                <Navigate to="/admin" />
              )
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
