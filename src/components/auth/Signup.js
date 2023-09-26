/**
 * Signup component
 */

import { FormControl, TextField, Button, InputAdornment } from "@mui/material";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Builds and renders the signup component
 * @returns Signup component render
 */

// need further validation
// question ? can a use have the same name in the system?
// check if users email already exists

const Signup = () => {
  // //const handle submit
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const registrationHandler = (event) => {
    event.preventDefault();
    console.log("Registration Handler");

    // check if any field is empty
    if (
      name === "" ||
      email === "" ||
      dateOfBirth === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      // set error message
      setMessage("All fields must contain information. Try again.");

      // check if password is same as repeat password
    } else {
      // add user to database
      const newUser = {
        name: name,
        email: email,
        dateOfBirth: dateOfBirth,
        username: username,
        password: password,
      };

      const response = fetch("http://localhost:4000/Register", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      navigate("/");
    }
  };

  return (
    <section className="main-section" id="sign-up-screen">
      <h1>Sign Up</h1>
      <form onSubmit={registrationHandler}>
        <FormControl id="sign-up-form">
          <p>Name:</p>
          <TextField
            fullWidth
            id="name"
            variant="outlined"
            value={name}
            onChange={(event) => setName(event.target.value)}
            type="text"
            placeholder="Enter your name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonPinIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <p>Email:</p>
          <TextField
            fullWidth
            id="email"
            variant="outlined"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Enter your email address"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ContactMailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <p>Date of Birth:</p>
          <TextField
            fullWidth
            id="dateOfBirth"
            variant="outlined"
            value={dateOfBirth}
            type="date"
            onChange={(event) => setDateOfBirth(event.target.value)}
            placeholder="Enter your date of birth"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <p>Username:</p>
          <TextField
            fullWidth
            id="username"
            variant="outlined"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            type="text"
            placeholder="Enter your username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonPinIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <p>Password:</p>
          <TextField
            fullWidth
            id="password"
            variant="outlined"
            value={password}
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <p>Password Validation:</p>
          <TextField
            fullWidth
            id="confirmPassword"
            variant="outlined"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
            placeholder="Verify your password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          {/* if the message is defined, show it */}
          {message && <p className="error-message">{message}</p>}
          <div id="registration-btn-div">
            <Button id="sign-up-btn" variant="contained" type="submit">
              Sign Up
            </Button>
            <Button
              href="/"
              id="cancel-sign-up-btn"
              className="cancel-btn"
              variant="contained"
            >
              Cancel
            </Button>
          </div>
        </FormControl>
      </form>
    </section>
  );
};

//Export the signup component
export default Signup;
