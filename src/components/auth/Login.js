/**
 * Login component
 */

import {
  TextField,
  InputAdornment,
  FormControl,
  IconButton,
  Button,
} from "@mui/material";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import {
  setAccessToken,
  setSideMenuOption,
  setUserID,
  setUserSession,
} from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";

import { login } from "../../services/userAPI";

/**
 * Builds and renders the login component
 * @returns Login component render
 */
const Login = ({ setIsLoggedIn }) => {
  //Props
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // loading state handler
  const [loading, setLoading] = useState(false);

  const loginHandler = async (event) => {
    event.preventDefault();
    console.log("LOGIN HANDLER");
    // set loading flag to true
    setLoading(true);

    let response;

    if (username === "" || password === "") {
      // Set error message
      setMessage("Both email and password required. Try again.");
      //Disable loading state
      setLoading(false);
    } else {
      //TODO - Attempt login request

      try {
        const requestBody = {
          username: username,
          password: password,
        };

        response = await login(requestBody);
        setMessage("Login Succesful");
        setUserID(response.data.AccountID);
        setAccessToken(response.data.token);
        setUserSession(requestBody);
        setSideMenuOption(0);
        setIsLoggedIn(true);
        // navigate to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
        setMessage("Invalid email or password. Try again.");
      } finally {
        //Disable loading state
        setLoading(false);
      }
    }
  };

  return (
    <section className="main-section" id="login-screen">
      <div id="login-form-container">
        <form onSubmit={loginHandler}>
          <FormControl id="login-form">
            <p>Username:</p>
            <TextField
              fullWidth
              variant="outlined"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              id="email"
              placeholder="Enter your username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ContactMailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <p>Password:</p>
            <TextField
              fullWidth
              variant="outlined"
              value={password}
              type={showPassword ? "text" : "password"}
              onChange={(event) => setPassword(event.target.value)}
              id="password"
              placeholder="Enter your password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* if the message is defined, show it */}
            {message && <p className="error-message">{message}</p>}
            {/* if the system is loading, show temp flag */}
            {loading && <p>We are logging you in....</p>}
            <div id="login-button-div">
              <Button variant="contained" id="login-btn" type="submit">
                Login
              </Button>
            </div>
          </FormControl>
        </form>
        <span id="login-link">
          Need to create an account?
          <a href="/signup">Register</a>
          here
        </span>
      </div>

      <div id="login-bg-shape"></div>
    </section>
  );
};

//Export the login component
export default Login;
