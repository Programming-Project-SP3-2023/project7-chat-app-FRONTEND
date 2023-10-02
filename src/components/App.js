/**
 * React main component module
 */

// Dependencies
import { Routes, Route } from "react-router-dom";

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

// Socket.IO setup (using local server --> pull github repo 'temp-chat-server')
import socketIO from "socket.io-client";
const socket = socketIO.connect("http://localhost:4000");

function App() {
  const user = getUser();
  const [isLoggedIn, setIsLoggedIn] = useState(user ? true : false);

  useEffect(() => {
    setIsLoggedIn(user ? true : false);
  }, [user, isLoggedIn]);

  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="login"
          element={<Login setIsLoggedIn={setIsLoggedIn} socket={socket} />}
        />
        <Route path="signup" element={<Signup />} />
        <Route path="dashboard">
          <Route path="" element={<Dashboard socket={socket} />} />
          <Route path="friends" element={<Friends />} />
          <Route path="groups" element={<Groups />} />
        </Route>
        <Route path="channels">
          <Route path="" element={<Channels />} />
          <Route path="create-new" element={<CreateNewChannel />} />
          <Route path="join" element={<JoinChannel />} />
        </Route>
        <Route path="search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
