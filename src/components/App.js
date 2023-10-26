/**
 * React main component module
 */

// Dependencies
import { Routes, Route, Navigate } from "react-router-dom";
import { useSocket } from "../services/SocketContext";

// Components
import Home from "./base/Home";
import Header from "./base/Header";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Dashboard from "./profile/Dashboard";
import Channels from "./channels/Channels";
import Search from "./search/Search";
import Footer from "./base/Footer";
import NotFound from "./base/NotFound";
import CreateNewChannel from "./channels/CreateNewChannel";
import JoinChannel from "./channels/JoinChannel";
import Friends from "./profile/Friends";
import Groups from "./profile/Groups";
import { getUser } from "../utils/localStorage";
import { useState, useEffect } from "react";
import DashboardMain from "./profile/DashboardMain";
import ChatUI from "./DM/ChatUI";

function App() {
  const user = getUser();
  const [isLoggedIn, setIsLoggedIn] = useState(user ? true : false);
  const [refresh, setRefresh] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("Echo");

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
        <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="signup" element={<Signup />} />
        <Route
          path="dashboard"
          element={
            isLoggedIn ? (
              <Dashboard
                refresh={refresh}
                setRefresh={setRefresh}
                headerTitle={headerTitle}
                setHeaderTitle={setHeaderTitle}
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
                setHeaderTitle={setHeaderTitle}
              />
            }
          >
            <Route path=":groupId" element={<ChatUI />}>
              <Route path=":channelId" element={<ChatUI />} />
            </Route>
          </Route>
        </Route>
        <Route path="channels">
          <Route
            path=""
            element={isLoggedIn ? <Channels /> : <Navigate to="/login" />}
          />
          <Route
            path="create-new"
            element={
              isLoggedIn ? <CreateNewChannel /> : <Navigate to="/login" />
            }
          />
          <Route
            path="join"
            element={isLoggedIn ? <JoinChannel /> : <Navigate to="/login" />}
          />
        </Route>
        <Route
          path="search"
          element={isLoggedIn ? <Search /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
