/**
 * Homepage component
 */

import { Button } from "@mui/material";

/**
 * Builds and renders the homepage component
 * @returns Homepage component render
 */
const Home = () => {
  return (
    <section className="main-section" id="home-screen">
      <div id="home-bg-shape"></div>
      <div className="home-btns">
        <Button variant="contained" id="home-login-btn" href="/login">
          Log in
        </Button>
        <Button variant="contained" id="home-signup-btn" href="/signup">
          Sign up
        </Button>
      </div>
    </section>
  );
};

//Export the homepage component
export default Home;
