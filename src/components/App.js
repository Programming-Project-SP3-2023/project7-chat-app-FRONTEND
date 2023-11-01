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
import Dashboard from "./profile/Dashboard";
import Footer from "./base/Footer";
import NotFound from "./base/NotFound";
import Friends from "./friends/Friends";
import Groups from "./groups/Groups";
import { getUser } from "../utils/localStorage";
import { useState, useEffect } from "react";
import DashboardMain from "./profile/DashboardMain";
import ChatUI from "./DM/ChatUI";
import GroupChatUI from "./DM/GroupChatUI";

function App() {
  const user = getUser();
  const [isLoggedIn, setIsLoggedIn] = useState(user ? true : false);
  const [refresh, setRefresh] = useState(false);
  const [groupReload, setGroupReload] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("Echo");
  const [accessTokenFast, setAccessTokenFast] = useState(null);

  useEffect(() => {
    setIsLoggedIn(user ? true : false);
  }, [user, isLoggedIn, refresh]);

  return (
    <div className="App">
      <Header
        isLoggedIn={isLoggedIn}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <Routes>
        <Route path="/" element={<Home />} />
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
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<DashboardMain />} />
          <Route path="friends" element={<Friends />}>
            <Route path=":id" element={<ChatUI />} />
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
              />
            }
          >
            <Route path=":groupId" element={<GroupChatUI />}>
              <Route path=":channelId" element={<GroupChatUI />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
