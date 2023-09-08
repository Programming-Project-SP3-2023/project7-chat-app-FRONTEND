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
import Profile from "./profile/Profile";
import Channels from "./channels/Channels";
import Search from "./search/Search";
import Footer from "./base/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
