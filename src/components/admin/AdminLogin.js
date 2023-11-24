/**
 * Admin Login component
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
import { useState, useEffect } from "react";
import {
  setAccessToken,
  setAdminID
} from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/adminAPI";


/**
 * Builds and renders the login component
 * @returns Login component render
 */
const AdminLogin = ({ setAdminIsLoggedIn, setAdminTitle }) => {
  //Props
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // loading state handler
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAdminTitle("");
  }, []);

  const loginHandler = async (event) => {
    event.preventDefault();
    // set loading flag to true
    setLoading(true);

    let response;

    if (username === "" || password === "") {
      // Set error message
      setMessage("Both email and password required. Try again.");
      //Disable loading state
      setLoading(false);
    } else {
      try {
        const requestBody = {
          username: username,
          password: password,
        };

        response = await adminLogin(requestBody);

        if (response.status === 200) {
          const data = response.data;

          if (data.errorType === "InvalidCredentials") {
            setMessage(data.message);
          } else if (data.errorType === "EmailNotVerified") {
            setMessage(data.message);
          } else {
            setAdminID(response.data.AccountID);
            setAccessToken(response.data.token);
            setMessage("Login Succesful");
            setAdminIsLoggedIn(true);
            navigate("users");
          }
        } else {
          setMessage(
            "An error has occurred on the server! Please try again later"
          );
        }
      } catch (error) {
        setMessage(
          "An error has occurred on the server! Please try again later"
        );
      } finally {
        //Disable loading state
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div id="login-form-container">
        <h1 id="admin-login-title">Admin Portal Login</h1>
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
      </div>

      <div id="login-bg-shape"></div>
    </>
  );
};

//Export the login component
export default AdminLogin;
