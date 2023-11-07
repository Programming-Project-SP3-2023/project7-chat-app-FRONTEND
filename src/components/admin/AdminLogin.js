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
  setSideMenuOption,
  setUserID,
  setUserSession,
} from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";

import { getAvatarByID, getUserByID, login } from "../../services/userAPI";

import { useSocket } from "../../services/SocketContext";

/**
 * Builds and renders the login component
 * @returns Login component render
 */
const AdminLogin = ({ setIsLoggedIn, setAccessTokenFast, setAdminTitle }) => {
  //Props
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginSocket } = useSocket();

  // loading state handler
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAdminTitle("Admin Portal Login");
  }, []);

  const loginHandler = async (event) => {
    event.preventDefault();
    console.log("LOGIN HANDLER");
    // set loading flag to true
    setLoading(true);

    let response;
    let userDataResponse;
    let avatarResponse;

    if (username === "" || password === "") {
      // Set error message
      setMessage("Both email and password required. Try again.");
      //Disable loading state
      setLoading(false);
    } else {
      try {
        console.log("THIS ATTEMPT");

        const requestBody = {
          username: username,
          password: password,
        };

        response = await login(requestBody);

        if (response.status === 200) {
          const data = response.data;

          if (data.errorType === "InvalidCredentials") {
            setMessage(data.message);
          } else if (data.errorType === "EmailNotVerified") {
            setMessage(data.message);
          } else {
            setUserID(response.data.AccountID);
            setAccessToken(response.data.token);
            setAccessTokenFast(response.data.token);

            userDataResponse = await getUserByID(
              response.data.AccountID,
              response.data.token
            );
            avatarResponse = await getAvatarByID(
              response.data.AccountID,
              response.data.token
            );

            let user;
            if (userDataResponse && avatarResponse) {
              user = {
                email: userDataResponse.email,
                displayName: userDataResponse.displayName,
                dob: userDataResponse.dob,
                username: userDataResponse.username,
                image: avatarResponse.avatarData,
              };
            } else if (userDataResponse && !avatarResponse) {
              user = {
                email: userDataResponse.email,
                displayName: userDataResponse.displayName,
                dob: userDataResponse.dob,
                username: userDataResponse.username,
              };
            }

            setMessage("Login Succesful");
            setUserSession(user);
            setSideMenuOption(0);
            setIsLoggedIn(true);

            // get session stored user / rather than fetching twice
            // socket.connect();
            loginSocket(response.data.AccountID, username);
            // navigate to dashboard
            navigate("/dashboard");
          }
        } else {
          setMessage(
            "An error has occurred on the server! Please try again later"
          );
        }
      } catch (error) {
        console.log(error);
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
