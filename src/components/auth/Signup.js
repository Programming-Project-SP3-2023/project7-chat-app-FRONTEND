/**
 * Signup component
 */

import { FormControl, TextField, Button, InputAdornment } from "@mui/material";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Modal, Fade } from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../../services/userAPI";

/**
 * Builds and renders the signup component
 * @returns Signup component render
 */

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
  const [openModal, setOpenModal] = useState(false);

  // loading flag
  const [loading, setLoading] = useState(false);

  // Open modal when registration is successful
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    // Redirect to the login page after closing the modal
    navigate("/login");
  };

  /**
   * Registration request handler
   * @param {*} event
   */
  const registrationHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

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

      await register(newUser)
        .then((response) => {
          // Open the modal on successful registration
          handleOpenModal();
        })
        .catch((error) => {
          setMessage(
            "Sorry, an error has occurred during registration, please try again later!"
          );
        })
        .finally(() => {
          //Disable loading
          setLoading(false);
        });
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
            inputProps={{ min: "1900-01-01", max: "2010-01-01" }}
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
          {/* if the system is loading, show temp flag */}
          {loading && <p>Registration in progress....</p>}
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

          {/* Modal component */}
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            closeAfterTransition
            className="modal-container"
          >
            <Fade in={openModal}>
              <div className="modal-paper">
                <h2 id="transition-modal-title">Check your email</h2>
                <p id="transition-modal-description">
                  An email has been sent to your email address. Please check your
                  email before logging in and verify your account!
                </p>
                <Button variant="contained" id="modal-okay-button" onClick={handleCloseModal}>
                  Okay
                </Button>
              </div>
            </Fade>
          </Modal>
        </FormControl>
      </form>
    </section>
  );
};

//Export the signup component
export default Signup;
