/**
 * Login component
 */

import {
  TextField,
  InputAdornment,
  FormControl,
  IconButton,
  Button
} from "@mui/material";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { setUserSession } from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";

/**
 * Builds and renders the login component
 * @returns Login component render
 */
const Login = ({setIsLoggedIn}) => {
  //Props
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loginHandler = (event) => {
    event.preventDefault();
    console.log("LOGIN HANDLER");

    if (email === "" || password === "") {
      // Set error message
      setMessage("Both email and password required. Try again.");
    } else {
      //TODO - Attempt login request
      // for now, store user details in localstorage
      const user = {
        email: email,
        password: password,
      };
      // set user data in local storage
      setUserSession(user);
      setIsLoggedIn(true);
      // navigate to dashboard
      navigate("/dashboard");
    }
  };

  return (
    <section className="main-section" id="login-screen">
      <div id="login-form-container">
        <form onSubmit={loginHandler}>
          <FormControl id="login-form">
            <p>Email:</p>
            <TextField
              fullWidth
              variant="outlined"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              id="email"
              placeholder="Enter your email address"
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
